import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../NavBars/Sidebar";
import TopBar from "../NavBars/TopBar";
import {
	Box,
	Grid,
	Stack,
	Typography,
	useMediaQuery,
	Button,
	Paper,
	InputBase,
	FormControl,
	Radio,
	RadioGroup,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import AnalysisReport from "./AnalysisReport";
import LinearProgressBar from "../../helpers/LinearProgressBar";
import YouTubeLogo from "../../images/YouTube.jpg";
import axios from "axios";

function SpecificPhoneAnalysis() {
	//Drawers for when size of screen is small
	const [open, setOpen] = useState(false);

	const [phoneName, setPhoneName] = useState("");
	const [channelName, setChannelName] = useState("mkbhd");

	// For scrolling to report and progress bar
	const sectionRef = useRef(null);

	
	const [progress, setProgress] = useState(0);
	const [progressText, setProgressText] = useState("");

	const [videoName, setVideoName] = useState("");
	const [videoLink, setVideoLink] = useState("");

	//State when the button for analysis is clicked
	const [showAnalysis, setShowAnalysis] = useState(false);

	const [resultFetched, handleResultFetched] = useState(false);

	const [failure, setFailure] = useState(false);

	
	let [aspects, setAspects] = useState({});


	const scrollToAnalysis = () => {
		if (sectionRef.current !== null) {
			sectionRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
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
					channel: channelName
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
				text:
					"- Pixel has always been a leader in smartphone innovation, and we take it as a compliment when others in the industry follow our lead, like the always-on display and At a Glance introduced with Pixel 2, and there's Night Sight, which launched with Pixel 3, and astrophotography, and we introduced car crash detection three years ago. (car windshield shattering) Pixel 7 and Pixel 7 Pro's front camera uses our advanced machine learning models for face recognition to power face unlock. - iPhone X, your iPhone is locked until you look at it and it recognizes you. We call this Face ID. - We're introducing Cinematic Blur to the Pixel camera. - And iPhone 13 brings a brand-new feature, Cinematic mode. - Starting at 2x, Super Res Zoom crops Pixel 7 Pro's main 50-megapixel camera using a high-resolution mode to provide a 12.5-megapixel image. - [Presenter] 12 megapixels of the new sensor to deliver a full resolution photo and 4K video with optical quality. - Yeah, I kind of just love how tech companies just throw subtle shots at each other on stage, even though we all know at this point they're just copying each other in a giant circle till we have the same features across everything. Anyway, today was Google's event and we got our first look and impressions and our hands-on time with the Google Pixel 7 and Pixel 7 Pro and the Pixel Watch, which is really interesting. And we also got a preview of a really interesting look at the new Pixel Tablet. So this video's everything you need to know about all that stuff.",
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



	const handleEnterKey = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
			setShowAnalysis(true);
		}
	};

	const handleChannelName = (event) => {
		setChannelName(event.target.value);
		console.log(channelName);
	};

	//matches variable for when screen is less than medium
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));

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
					<Paper
						component="form"
						sx={{
							p: "7px 7px",
							display: "flex",
							alignItems: "center",
							marginTop: "2rem",
							marginBottom: "2rem",
							marginRight: "5rem",
							marginLeft: "2rem",
						}}
						elevation={2}
					>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder={"Provide name of the smartphone for analysis"}
							inputProps={{
								"aria-label": `${"SmartphoneName"}`,
							}}
							value={phoneName}
							onChange={(event) => setPhoneName(event.target.value)}
							onKeyDown={handleEnterKey}
						/>
						<Button
							variant="contained"
							sx={{
								textTransform: "none",
								backgroundColor: "dodgerblue",
							}}
							size="small"
							onClick={handleAnalysisClick}
						>
							Analysis of a Smartphone
						</Button>
					</Paper>
					<Box marginLeft={"8rem"}>
						<FormControl>
							<RadioGroup
								aria-labelledby="radio-buttons"
								defaultValue="mkbhd"
								name="radio-buttons-group"
								value={channelName}
								onChange={handleChannelName}
								row
							>
								<Typography
									fontWeight={"bold"}
									marginTop={"0.5rem"}
									marginRight={"0.5rem"}
								>
									Select preferred channel name of YouTube for Smartphone
									review:{" "}
								</Typography>
								<FormControlLabel
									value="mkbhd"
									control={<Radio />}
									label="MKBHD"
									checked={channelName === "mkbhd" ? true : false}
								/>
								<FormControlLabel
									value="gsm-arena"
									control={<Radio />}
									label="GSM Arena"
								/>
								<FormControlLabel
									value="other"
									control={<Radio />}
									label="Other"
								/>
							</RadioGroup>
						</FormControl>
					</Box>
					<Grid container justifyContent={"center"}>
						<Grid item xs={6}>
							{/* {showAnalysis && <AnalysisReport features={aspects} />} */}
							{/* {showAnalysis && (
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
									<LinearProgressBar />
								</Box>
							)} */}

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
				</Grid>
			</Grid>
		</Box>
	);
}
export default SpecificPhoneAnalysis;
