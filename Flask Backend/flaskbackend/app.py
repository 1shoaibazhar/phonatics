from flask import Flask, request, jsonify
from os import environ
from apiclient.discovery import build
from math import ceil
from pytube import YouTube
import os
import nltk
import pyabsa
import collections
import librosa 
import soundfile as sf
import pickle
from dotenv import load_dotenv
from flask_cors import CORS
from more_itertools import locate
from additionalFunctions import filterSentiments, get_singular
load_dotenv()



app = Flask(__name__)
CORS(app)
app.config['API_KEY'] = environ.get('API_KEY')
youtubeAPI  = build('youtube', 'v3', developerKey=app.config['API_KEY'])

# Loading the model file
filename = '10kTunedModel.sav'
sentiment_classifier = pickle.load(open(filename, 'rb'))

nltk.download('punkt')


# API to search mobile device
@app.route('/search', methods = ['POST','GET'])
def search():
    if request.method == 'POST':
        # user_input = request.form.get('name')
        user_input = request.json
        requestedPhone = str(user_input["name"])

        searchPhone = requestedPhone.lower()
        
        requestedChannel = ""
        if "channel" in user_input:
            requestedChannel = str(user_input["channel"])

        channelId = ""
        
        if requestedChannel == "mkbhd":
            channelId = "UCBJycsmduvYEL83R_U4JriQ"
        elif requestedChannel == "gsm-arena":
            channelId = "UCbLq9tsbo8peV22VxbDAfXA"

        # If no channelId provided
        if channelId == "" :

            print("No Channel Id")
                
            # Making the API request
            # Fetching top 3 search results of youtube

            # Currently using channel id of MKBHD
            # UCBJycsmduvYEL83R_U4JriQ
            

            req = youtubeAPI.search().list(q=searchPhone, part='snippet', type='video', maxResults = 1, channelId = 'UCBJycsmduvYEL83R_U4JriQ')

            try:         
                res = req.execute()

            except:
                return "Error while executing youtube api", 404

            # Now extracting titles and video ids of the related videos

            responseResult = {}
            for item in res['items']:
                vidTitle = item['snippet']['title']
                vidId = item['id']['videoId']

                #  Testing if the phone is actually present in the videos fetched
                if searchPhone in vidTitle.lower():
                    responseResult[vidTitle] = vidId



            # If mobile not found on both the channels
            if len(responseResult) == 0:
                
                    
                # Another channel id of GSM Arena
                # UCbLq9tsbo8peV22VxbDAfXA

                req = youtubeAPI.search().list(q=searchPhone, part='snippet', type='video', maxResults = 1, channelId = 'UCbLq9tsbo8peV22VxbDAfXA')

                try:         
                    res = req.execute()

                except:
                    return "Error while executing youtube api", 404

                # Now extracting titles and video ids of the related videos

                for item in res['items']:
                    vidTitle = item['snippet']['title']
                    vidId = item['id']['videoId']

                    #  Testing if the phone is actually present in the videos fetched
                    if searchPhone in vidTitle.lower():
                        responseResult[vidTitle] = vidId


                
                # If mobile not found on both the channels
                if len(responseResult) == 0:
                    
                    print("Mobile device not found")
                    
                    return "Mobile device not found!", 200
                
                else:
                    responseResult["channelName"] = "GSM Arena"
            
            else:
                responseResult["channelName"] = "Marquees Brownlee"

            
            # Returning a dictionary with video titles and their ids and channel name
            return responseResult
        
        else:
            req = youtubeAPI.search().list(q=searchPhone, part='snippet', type='video', maxResults = 1, channelId = channelId)

            try:         
                res = req.execute()

            except:
                return "Error while executing youtube api", 404

            # Now extracting titles and video ids of the related videos

            responseResult = {}
            for item in res['items']:
                vidTitle = item['snippet']['title']
                vidId = item['id']['videoId']

                #  Testing if the phone is actually present in the videos fetched
                if searchPhone in vidTitle.lower():
                    responseResult[vidTitle] = vidId



            # If mobile not found 
            if len(responseResult) == 0:
                
                print("Mobile device not found")
                
                return "Mobile device not found!", 200
            
            else:
                
                if requestedChannel == "mkbhd":
                
                    responseResult["channelName"] = "Marquees Brownlee"
                elif requestedChannel == "gsm-arena":
                    responseResult["channelName"] = "GSM Arena Official"
                
                return responseResult
                

    else:
        return 'Invalid Request', 404
    

# API to download audio of the selected videos
@app.route('/getAudioFiles', methods=['GET','POST'])
def getAudioFiles():
    if request.method == 'POST':
        
        user_input = request.json

        # Getting all keys
        # Data comes in format e.g.
        # {
        #     video Title: video id 
        # }

        allVideoIds = list(user_input.values())
        allTitles = list(user_input.keys())

        response = {}

        # Downloaded all the videos
        for i in range(len(allVideoIds)):

            # Using try and except in case the video id sent is invalid, it will catch the exeception thrown
            try:
                yt = YouTube(str("https://www.youtube.com/watch?v="+allVideoIds[i]))
                video = yt.streams.filter(only_audio=True).first()
                destination = '.'
                out_file = video.download(output_path=destination)
                base, ext = os.path.splitext(out_file)
                new_file = base + '.wav'
                os.replace(out_file, new_file)
                
                # Converting to correct wav format
            
                fileNameExtracted = new_file.split("\\")[-1]
                                
                x,_ = librosa.load(fileNameExtracted, sr=16000)
                
                os.remove(fileNameExtracted)
                
                sf.write(fileNameExtracted, x, 16000)
                
                response[allTitles[i]] = "Done"
            except Exception as e:
                response[allTitles[i]] = "Error"
                print("Error = \n" , e)

        # Response will show if any video has any exception or error while downloading
        return response

    else:
        return 'Invalid Request', 404
    

# Speech to text API
@app.route('/speechToText', methods=['GET','POST'])
def speechToText():
    if request.method == 'POST':
        
        return "To be developed"

    else:
        return 'Invalid Request', 404
    

# PYABSA API
@app.route('/sentiment', methods=['GET','POST'])
def sentimentAnalysis():
    if request.method == 'POST':
        
        # Incoming data format
        # {
        #     "text": video's text
        # }

        user_input = request.json
        videoText = user_input["text"]
        textData = videoText.lower()
        
        tokenizedText = nltk.tokenize.sent_tokenize(textData)


        result = []

        inference_source = tokenizedText


        try:
            
            atepc_result = sentiment_classifier.extract_aspect(inference_source=inference_source,
                                            #    save_result=True,
                                            #    print_result=True,  # print the result
                                               pred_sentiment=True,  # Predict the sentiment of extracted aspect terms
                                               )
            
            # Three seperate lists for corresponding aspects, sentiments and confidence
            result.append([])
            result.append([])
            result.append([])
            result.append([])
            
            # Looping over result of each sentiment in the data
            for sentiment_result in atepc_result:
                for aspect_in_result in sentiment_result['aspect']:
                    
                    # Singularizing sentiments
                    aspectSingular = get_singular(aspect_in_result)
                    result[0].append(aspectSingular)
                    
                for sentiment_in_result in sentiment_result['sentiment']:
                    result[1].append(sentiment_in_result)
                for confidence_in_result in sentiment_result['confidence']:
                    result[2].append(confidence_in_result)

           
            # Checking if result is not empty     
            if len(result[0]) != 0 :    
                
                
                # Calculating rating of the derived aspects 
                for i in range(len(result[0])):           
                    
                    
                    tmpSentiment = result[1][i]
                    tmpConfidence = result[2][i]
                
                    if tmpSentiment == "Negative":
                        tmpConfidence = tmpConfidence * 10
                        
                        rating = ceil(10 - tmpConfidence)
                        
                        result[3].append(round(rating,1))

                    else:
                        tmpConfidence = tmpConfidence * 10
                        rating = tmpConfidence
                        result[3].append(round(rating,1))
                    
                    

                
                # Removing duplicates and taking mean
                
                # Getting all duplicate values
                duplicates = [item for item, count in collections.Counter(result[0]).items() if count > 1]
                    
                print("Duplicates = ", duplicates)
                
                
                if len(duplicates) != 0 :
                
                
                    tmpResult = result

                    

                    for duplicateValue in duplicates:
                        duplicatesResults = []
                        # Finding all the indexes of the duplicate values 
                        indexesOfDuplicate = list(locate(tmpResult[0], lambda x: x == duplicateValue))
                        
                        duplicatesResults.append([])
                        duplicatesResults.append([])
                        duplicatesResults.append([])
                        duplicatesResults.append([])
                        
                        iterationValueCorrection = 0
                        for indexVal in indexesOfDuplicate:
                            
                            for x in range(len(tmpResult)):
                                
                                duplicatesResults[x].append(tmpResult[x][indexVal-iterationValueCorrection])
                                del tmpResult[x][indexVal-iterationValueCorrection]
                            
                            iterationValueCorrection+=1
                        
                        # Pouring the duplicate results back in after taking mean of the rating
                        totalRating = 0
                        meanDenominator = 0
                        for x in range(len(duplicatesResults[0])):
                            
                            totalRating += duplicatesResults[3][x]
                            meanDenominator+=1
                        
                        totalRating = totalRating / meanDenominator
                        
                        # Counting the total confidence
                        totalConfidence = 0
                        meanDenominator = 0
                        for x in range(len(duplicatesResults[0])):
                            
                            totalConfidence += duplicatesResults[2][x]
                            meanDenominator+=1
                        
                        totalConfidence = totalConfidence / meanDenominator
                        
                        # Calculating the wether the overall sentiment was positive or negative
                        
                        totalSentiment = ""
                        if totalRating > 5 :
                            totalSentiment = "Positive"
                        else:
                            totalSentiment = "Negative"
                        
                        
                        # Putting value back in
                        tmpResult[0].append(duplicateValue)
                        tmpResult[1].append(totalSentiment)
                        tmpResult[2].append(totalConfidence)
                        tmpResult[3].append(round(totalRating,1))
                    

        except Exception as e:
            print('Error = '+ str(e))
            return "Error While Executing PYABSA Model", 404


        # return inference_source
        
        
        # Modifiying the result to change it to dictionary
        
        resultDict = {}
        
        for i in range(len(result[0])):
            resultDict[result[0][i]] = result[3][i]

        
        # Filtering the sentiments
        
        resultDict = filterSentiments(resultDict)
        
        return jsonify(resultDict)

    else:
        return 'Invalid Request', 404
    



if __name__ == "__main__":
    app.run(debug=True)




