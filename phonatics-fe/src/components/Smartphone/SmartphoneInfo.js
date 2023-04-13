import React, { useState, forwardRef, useRef } from "react";
import { useGlobalCart } from "../../contexts/CartItems";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../NavBars/Sidebar";
import TopBar from "../NavBars/TopBar";
import "../../css/phonaticsName.css";
import "../../css/styles.css";
import {
	Box,
	Grid,
	Stack,
	Typography,
	Rating,
	Snackbar,
	Alert,
	useMediaQuery,
} from "@mui/material";
import PhoneSpecs from "./PhoneSpecs";
import { useGlobalSmartphones } from "../../contexts/SmartphonesContext";
import AnalysisReport from "./AnalysisReport";
import LinearProgressBar from "../../helpers/LinearProgressBar";
import YouTubeLogo from "../../images/YouTube.jpg";
import axios from "axios";

//Component to show detailed information of a smartphone on the web application
function SmartphoneInfo() {
	// Data of the clicked smartphone is passed on the navigation using state
	// const { state } = useLocation();
	const { clickedSmartphone, handlePhoneAvailability } = useGlobalSmartphones();
	const { handleAddCart } = useGlobalCart();
	var nf = new Intl.NumberFormat();

	let [aspects, setAspects] = useState({});

	//Extracting information
	const {
		img,
		phoneName,
		phoneDesc,
		seller,
		sellerLocation,
		amount,
		features,
		availability,
	} = clickedSmartphone;

	//Drawers for when size of screen is small
	const [open, setOpen] = useState(false);

	// For scrolling to report and progress bar
	const sectionRef = useRef(null);

	const scrollToAnalysis = () => {
		if (sectionRef.current !== null) {
			sectionRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	};
	const [progress, setProgress] = useState(0);
	const [progressText, setProgressText] = useState("");

	const [videoName, setVideoName] = useState("");
	const [channelName, setChannelName] = useState("");
	const [videoLink, setVideoLink] = useState("");

	//State when the button for analysis is clicked
	const [showAnalysis, setShowAnalysis] = useState(false);

	const [resultFetched, handleResultFetched] = useState(false);

	const [failure, setFailure] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	//Handling add to cart button functionality
	const handleAddToCart = () => {
		clickedSmartphone.availability -= 1;
		handleAddCart(clickedSmartphone);
		handlePhoneAvailability(clickedSmartphone, "decrease");
		setSuccessReq(true);
		setSnackOpen(true);
	};

	const handleAnalysisClick = async () => {
		setShowAnalysis(true);
		setTimeout(() => {
			scrollToAnalysis();
		}, 500);

		let videoTags = {};
		let audioFileApi = {};
		let textApi = {};
		let sentimentAnalysisRes = {};

		async function getVideoTags() {
			try {
				let req = await axios.post("http://localhost:5000/search", {
					name: phoneName,
				});

				let dataReturned = req.data;

				if (dataReturned !== "Mobile device not found!") {
					setChannelName(dataReturned["channelName"]);

					delete dataReturned["channelName"];

					videoTags = dataReturned;

					setVideoName(Object.keys(videoTags));

					let tmpString =
						"https://www.youtube.com/watch?v=" + Object.values(videoTags);

					setVideoLink(tmpString);

					setProgress(() => 25);
					setProgressText(() => "Fetched Relevant Videos!");

					console.log("Progress = 25");

					return true;
				} else {
					return false;
				}
			} catch (e) {
				console.log("Error while fetching video tags \n", e);
			}
		}

		async function getAudioFiles() {
			try {
				let req = await axios.post(
					"http://localhost:5000/getAudioFiles",
					videoTags
				);

				audioFileApi = req.data;

				setProgress(() => 50);
				setProgressText(() => "Gathered Required Files1");

				console.log("Progress = 50");
			} catch (e) {
				console.log("Error while fetching audio ids \n", e);
			}
		}

		async function speechToText() {
			try {
				let req = await axios.post(
					"http://localhost:5000/speechToText",
					audioFileApi
				);
				textApi = req.data;
				setProgress(() => 75);
				setProgressText(() => "Performing Conversions!");
				console.log("Progress = 75");
			} catch (e) {
				console.log("Error while fetching speech to text \n", e);
			}
		}

		async function sentimentAnalysis() {
			// Temporarily setting the text

			textApi = {
				text: "- Pixel has always been a leader in smartphone innovation, and we take it as a compliment when others in the industry follow our lead, like the always-on display and At a Glance introduced with Pixel 2, and there's Night Sight, which launched with Pixel 3, and astrophotography, and we introduced car crash detection three years ago. (car windshield shattering) Pixel 7 and Pixel 7 Pro's front camera uses our advanced machine learning models for face recognition to power face unlock. - iPhone X, your iPhone is locked until you look at it and it recognizes you. We call this Face ID. - We're introducing Cinematic Blur to the Pixel camera. - And iPhone 13 brings a brand-new feature, Cinematic mode. - Starting at 2x, Super Res Zoom crops Pixel 7 Pro's main 50-megapixel camera using a high-resolution mode to provide a 12.5-megapixel image. - [Presenter] 12 megapixels of the new sensor to deliver a full resolution photo and 4K video with optical quality. - Yeah, I kind of just love how tech companies just throw subtle shots at each other on stage, even though we all know at this point they're just copying each other in a giant circle till we have the same features across everything. Anyway, today was Google's event and we got our first look and impressions and our hands-on time with the Google Pixel 7 and Pixel 7 Pro and the Pixel Watch, which is really interesting. And we also got a preview of a really interesting look at the new Pixel Tablet. So this video's everything you need to know about all that stuff. So the phones, there's a big phone and a small phone again. The Pixel 7 and the Pixel 7 Pro. They very much look like the Pixel 6 now that it's an established, recognizable visor identity, but this time the visor is metal instead of glass, and I don't love it but I also don't hate it. Like, I guess I was one of the few people that really got to liking the glass visor. But I will say, this time it is one continuous piece of metal all the way around with no seam and that is better than before. And it just feels really well built. But you can also see the Pixel 7 visor is matte while the Pixel 7 Pro visor is glossy, which I can already tell I'm gonna get this 7 Pro covered in fingerprints. Also, I'm just gonna say I miss accented color power buttons. Just throwing that out there. Anyway, no other real design surprises here. But then on the inside, there is an updated set of specs. So there they are. You can pause this if you need to, but, basically, the bigger phone has a telephoto lens, more RAM and a bigger battery and a bigger, higher res LTPO display. That's the deal. But here's something I noticed that wasn't really mentioned even out loud during the keynote, which is the Pixel 7 display is flat again and you can see the cutout at the top for the new ultrawide 11-megapixel selfie camera that they both share. It's pretty sweet. But the Pixel 7 Pro display curves over the edges a bit less than before. It's just a subtle curve now. I'm really happy to see that. But then as I mentioned in the last video, which was about the iPhone 14 Plus and benchmarks and how the big general benchmark improvements are probably going to be pretty slight, I was more interested just to see features, just new interesting features that they enable on these new phones, right? And we got some and they range from kind of cool, seen that already, all the way to possibly incredible. So yeah, I'm gonna keep my eye out on the overall performance of this next-generation Tensor G2 chip, efficiency, smoothness, all that. But it also enables a few things. A new cinematic video mode, which basically appears to be doing the same thing Apple's new Cinematic mode does, which is track subjects and artificially blur backgrounds. It also enables transcribed audio messages right in the Google Messages app. So if someone sends you a voice memo, you don't have to find a place to listen to it. You can just read it in text form. And it makes Night Sight twice as fast. It enables face unlock from just the new selfie camera. And it should be able to do all of this with 20% lower power consumption than the first Tensor chip. But the coolest feature to me easily is Unblur is what it's called. So say you have a picture that's slightly blurry, you know, maybe your hands were kind of shaky or it was slightly out of focus or you just had a slow shutter speed or something happened, it's blurry, it's soft. Normally you'd throw the photo out, but you don't have any other pictures of that moment and it was just too perfect and you kind of just wanna save it or fix it. So you can open that picture on the Pixel 7 or 7 Pro and you hit that button and the Tensor chip goes to work and it basically fixes the picture. It uses AI, it recognizes subjects and sharpens things up, and it does a really good job. You can see a before and after here of some of the preloaded photos I was trying at the event and they are genuinely impressive. And the cherry on top is, so you have to have a Pixel 7 or 7 Pro to do this for now, but you can do this with any picture in your entire Google Photos library, any photo you've ever taken or even any photo you just save or have on your phone. Anything. I can see people, like, remastering old Polaroids or, like, 30-year-old yearbook photos, just whatever else is in your library that you wanna save. Seems pretty cool. I'm gonna be testing it for the full review to see how well it actually works with non-pre-supplied photos. But I was impressed. But then really most of the other changes that were interesting about these phones came in the camera department on the Pro phone. So there's a new ultrawide with auto focus just on the Pro phone that is 21% wider and should be able to take some pretty decent macro photos now with these focus pixels. And there's a new 5x telephoto camera that's also huge, 48 megapixels again. And then they've worked a lot of software magic with making the in-between marks much more usable. So for example, the 2x button here will crop in to the middle 12 megapixels of the main camera for a nice clean zoom. Sound familiar? But then the 10x does the same thing. So the 10x zoom is really just cropping in to the middle 12 megapixels of the 5x telephoto camera. So again, hopefully a nice clean zoom. And then a lot of Super Res Zoom software magic and hopefully sharpening the photos of in between those numbers. But there's also haptic stops in the camera UI to make it easy to hopefully hit those nice clean magic numbers. And they also added a zoom preview thing for the furthest extremes of zoom like Samsung did. So now when you're taking those super creeper shots at like 30x, it'll be nice and stable and easy to frame. My biggest question is did they price these correctly? Because they went with the same prices as last year, which is 599 for the small phone and 899 for the big one, which, okay, it's the same... (sighs) I have a feeling $300 is gonna feel like a big gap again. Like, this is what we were saying last year. For 300 extra dollars over the small phone, you're getting bigger screen, nicer battery, and a telephoto camera, and that's kind of it. This year, it feels like a tiny bit more. It's screen, battery, and then like a whole pro camera system with a better ultrawide and a better telephoto with lots of zoom stuff. But is that enough? $300? I don't know. We'll see. I have a feeling that the 7 will feel like a good deal and then the 7 Pro will feel like a tougher sell again. But then we also finally got to see the Google Pixel Watch. This is the thing that's been kind of hyped a lot. I got to spend a little less time with it, but I'm very interested in reviewing this particular watch. So this might be a hot take but I think they did a B+ job on the design. I think it's really nice. The full circle is great. It's just one size, which is pretty small, and very lightweight. There's three colors: black, silver, and gold. And it definitely doesn't look like a computer on your wrist like some others can. It can be a super inconspicuous little puck of a smartwatch. There's just two buttons: the crown, which can also scroll, and then a button right above it. And the way the watch bands connect to the watch is pretty neat. It's a little bit finicky to me at first but I suspect that just takes some getting used to. And the result is just this super seamless look with no lugs where it looks like the band just kind of pops out the top and the bottom of the circle. Now, here's why I say B+ and not A+: bezels and battery. So they curved the glass right over all the edges and kept the UI mostly black, which is really thoughtful because most of the time, especially in lower lighting, it looks like it's basically a seamless display on your wrist. Most of the backgrounds are black. Most of the UI elements look like they're designed around sort of fading in and not overlapping the edges too much. And even when they do overlap, they have this nice little gradient. Even the flashlight app has a fade all the way around. So you don't really think too hard about the bezel. It's smart. But if you catch the light just right or maybe you're outside a lot, then, yeah, you can see the bezel, which is clearly not the smallest thing in the world. Okay, fine. But I'm actually a little bit more worried about battery life. So they said on stage up to 24 hours of battery, which, you know, knowing these companies is probably generous. Like, that's probably maybe best-case scenario without the always-on display, maybe one workout. And, I mean, this watch is truly tiny. It's very compact and light. Like, there's just no way it can have a huge battery in it. But I think it's a good idea to subscribe to be among the first to see the full review when it goes live and I get a chance to really test it. Functionality-wise, though, it is very much a Fitbit smartwatch. Like, I think it might be more of a Fitbit than a lot of people were expecting. But, you know, smartwatch-wise, it does all the normal stuff. Notifications, custom watch faces, Google Pay with Wallet, Google Maps directions, Google Assistant to set timers, play some music, et cetera. It's Wear OS. But then it's Fitbit for all the fitness stuff, which there's plenty of. So if you've used a Fitbit, you already know about the workouts and mindfulness content and health metrics and sleep tracking and a sleep score and it has some really high-frequency heart rate monitoring, one reading every single second. But other than specifically the heart rate monitoring stuff, it uses the Fitbit app for all of that stuff. So not Google Fit. What happens to Google fit? Unclear, actually. But the watch comes with six months of Fitbit Premium for free and you just interact with all this data just like it's a Fitbit. So yeah, it's a Fitbit smartwatch, or it's a smartwatch with Fitbit on top for all the fitness stuff. So it's 349 for the Wi-Fi only and $400 for cellular. So that means it's more expensive than the Apple Watch SE. It's more expensive than the Samsung Galaxy Watch5. It's interesting. Let me know which one of those smartwatches you would consider for that money. But lastly, we did get a preview of the tablet, another one. But this time, it was basically just one, one really cool feature, which is that it docks to a magnetic speaker dock and becomes basically a Nest Hub Max. And I think this is brilliant. Most tablets are just, like, around the house most of the time, and Google knows this, so they just built the ultimate house tablet, I guess. I do think, though, that this is a bit of a clue that this isn't going to be a super high-end, like iPad Pro, Galaxy Tab Pro, super crazy premium tablet. This is definitely not competing with those. Like, this thing will have a 10-inch screen, single camera, white bezels. It's like this thing is designed for the 80% of tablets that just sit around the house and don't do too much. Like, not the top few percent that are doing peak performance and productivity and media stuff. I'm guessing, and this is pure speculation, and you can quote this, I'm gonna guess that this will be a 499 tablet. Like, that's how I see this. And then you'll buy the dock extra. But we'll come back to this clip and see if I was right. But yeah, stay tuned for the reviews. Happy Techtober. Thanks for watching this one, and I'll catch you guys later. Peace. (bright electronic music)"
			};

			try {
				let req = await axios.post("http://localhost:5000/sentiment", textApi);
				sentimentAnalysisRes = req.data;
				setProgress(() => 100);
				setProgressText(() => "Gathered Sentiments!");
				console.log("Progress = 100");
				console.log("Sentiments = \n", sentimentAnalysisRes);
				setAspects(sentimentAnalysisRes);
			} catch (e) {
				console.log("Error while getting sentiment analysis \n", e);
			}
		}

		let getVideoApiRes = await getVideoTags();

		// If video is found
		if (getVideoApiRes) {
			await getAudioFiles();
			await speechToText();
			await sentimentAnalysis();
			setShowAnalysis(true);

			setTimeout(() => {
				handleResultFetched(true);
			}, 1000);
		}
		// If video is not found
		else {
			console.log("Video not found");
			setFailure(true);
		}
	};

	//matches variable for when screen is less than medium
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));

	// Snackbar code
	const [successReq, setSuccessReq] = useState(false);
	const [snackOpen, setSnackOpen] = useState(false);
	const handleSnackBarClick = (evt, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackOpen(false);
	};

	// Custom snackbar
	const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
		return <Alert elevation={6} ref={ref} {...props} />;
	});
	return (
		<Box ml={0}>
			<Grid container>
				<Grid item xs={2}>
					{/* Sidebar of the application */}
					<Sidebar
						open={open}
						handleDrawerClose={handleDrawerClose}
						matches={matches}
					/>
				</Grid>
				<Grid
					item
					xs={10}
					ml={matches ? "8%" : "20%"}
					sx={{ marginTop: "1.5em" }}
				>
					{/* When size of screen is small we have a menu to open sidebar and close it */}
					<TopBar
						matches={matches}
						open={open}
						handleDrawerOpen={handleDrawerOpen}
					/>
					<Box ml={0} mt={5}>
						<Grid container justifyContent="center">
							<Grid item lg={4} xs={12} md={6} style={{ textAlign: "center" }}>
								<Box
									component="img"
									sx={{
										width: "25em",
										height: "25em",
										objectFit: "fill",
										borderRadius: "10%",
										ml: 1,
										mr: 1,
										mt: 2,
										mb: 2,
									}}
									alt="Smartphone image"
									src={img}
								/>
								<button
									className="Add AddText"
									style={{ width: "16em" }}
									onClick={handleAnalysisClick}
								>
									ANALYSIS OF SMARTPHONE
								</button>
							</Grid>
							<Grid
								item
								lg={4}
								xs={12}
								style={{
									textAlign: "center",
									marginTop: "1.5em",
								}}
							>
								<h1 className="phoneInfo">{phoneName}</h1>
								<h1 className="phonePrice">Rs. {nf.format(amount)}</h1>

								<Typography
									variant="body1"
									color="black"
									component="div"
									sx={{
										lineHeight: "1.5",
										marginLeft: "3.6em",
										marginRight: "1em",
									}}
									align="justify"
								>
									{phoneDesc}
								</Typography>
							</Grid>
							<Grid
								item
								lg={4}
								xs={12}
								md={6}
								style={{
									textAlign: "center",
									marginTop: "5.6rem",
								}}
							>
								<Typography component="div" variant="h6" fontWeight={"700"}>
									{seller}
								</Typography>
								<Typography variant="body1" color="GrayText" component="div">
									{sellerLocation}
								</Typography>
								<Rating
									name="seller-rating"
									defaultValue={2.5}
									precision={0.5}
									readOnly
									size="small"
									sx={{ marginTop: "0.5em" }}
								/>
								<button
									className="Add AddText"
									onClick={handleAddToCart}
									disabled={availability === 0}
								>
									ADD TO CART
								</button>
								{/* If availability is > 0 then we show availability else Out of Stock */}
								{availability > 0 ? (
									<Typography
										variant="subtitle1"
										color="text.primary"
										component="div"
										fontWeight={"bold"}
										sx={{ marginTop: "2rem" }}
									>
										Availability: {availability}
									</Typography>
								) : (
									<Typography
										variant="subtitle1"
										color="text.primary"
										component="div"
										fontWeight={"bold"}
										sx={{ marginTop: "2rem" }}
									>
										Out of Stock
									</Typography>
								)}
							</Grid>
						</Grid>
						{/* Displaying phone specs table */}
						<Grid container>
							<Grid
								item
								xs={12}
								sx={{
									marginTop: "2em",
									marginBottom: "2em",
								}}
							>
								<PhoneSpecs features={features} />
							</Grid>
						</Grid>
						<Grid container justifyContent={"center"}>
							<Grid item xs={6}>
								{showAnalysis ? (
									!failure ? (
										resultFetched ? (
											<AnalysisReport
												features={aspects}
												videoName={videoName}
												videoLink={videoLink}
												channelName={channelName}
											/>
										) : (
											<Box mb={5} ref={sectionRef}>
												<Stack direction={"row"} spacing={2}>
													<Typography
														variant="h5"
														fontWeight="700"
														marginLeft={"4rem"}
														marginTop={"2.3rem"}
													>
														Aspect-Based Analysis Report
													</Typography>
													<img
														src={YouTubeLogo}
														alt="YouTube"
														width={100}
														height={100}
													/>
												</Stack>
												<LinearProgressBar
													progress={progress}
													progressText={progressText}
												/>

												<Typography
													variant="h6"
													fontWeight="200"
													marginLeft={"6rem"}
													marginTop={"2.3rem"}
													marginBottom={"4rem"}
													paddingLeft={"2rem"}
												>
													{progressText}
												</Typography>
											</Box>
										)
									) : (
										<Typography
											variant="h5"
											fontWeight="700"
											marginLeft={"4rem"}
											marginTop={"2.3rem"}
											marginBottom={"4rem"}
										>
											Sentiment Analysis Not Found
										</Typography>
									)
								) : (
									<></>
								)}
							</Grid>
						</Grid>
					</Box>
				</Grid>
				{/* Snackbar to show relevant alerts */}
				<Snackbar
					open={snackOpen}
					autoHideDuration={3000}
					onClose={handleSnackBarClick}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
				>
					{successReq === true ? (
						<SnackbarAlert onClose={handleSnackBarClick} severity="success">
							Phone added to Cart!
						</SnackbarAlert>
					) : (
						<SnackbarAlert onClose={handleSnackBarClick} severity="error">
							Unable to add phone to cart!
						</SnackbarAlert>
					)}
				</Snackbar>
			</Grid>
		</Box>
	);
}
export default SmartphoneInfo;
