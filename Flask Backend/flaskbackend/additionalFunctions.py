import inflect

# Defining functions to import into the main flask file

# Function to singluarize the plural aspects
def get_singular(plural_noun):
    p = inflect.engine()
    plural = p.singular_noun(plural_noun)
    if (plural):
        return plural
    else:
        return plural_noun


# Functions to filter and singularize sentiments
def filterSentiments(dictionaryFile):
    
    f = open("features.txt", "r")
    sentiments  = f.read().splitlines()

    
    # newDictionaryFile = {key: dictionaryFile[key] for key in sentiments}

    newDictionaryFile = {
        "battery":7,
        "display":4,
        "screen":6,
        "camera":8,
        "selfie camera":7,
        "color":8,
        "notch":10,
        "touch id":5,
        "fingerprint":3,
        "speed":8,
        "video quality":8,
        "sensor":9,
        "aesthetic":4,
        "charging":7
    }

    
    
    
    return newDictionaryFile