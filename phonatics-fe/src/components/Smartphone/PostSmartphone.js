import React, { useState, useEffect, forwardRef } from "react";
import "../../css/styles.css";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../NavBars/Sidebar";
import TopBar from "../NavBars/TopBar";
import useFormInputState from "../../hooks/useFormInputState";
import { useGlobalUser } from "../../contexts/UserContext";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import {
	Box,
	Grid,
	Stack,
	Button,
	Paper,
	TextField,
	Typography,
	Icon,
	useMediaQuery,
	Fab,
	Rating,
	Snackbar,
	Alert,
} from "@mui/material";

//Icons
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

//Component used by seller to post a smartphone on our application
function PostSmartphone() {
	const { globalUser } = useGlobalUser();

	//Handling the sidebar i.e. drawer
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	//Used to see if screen size is less than medium for responsiveness
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

	//Initial form value for posting the smartphone
	const initialFormValue = {
		img: "",
		phoneName: "",
		availability: 0,
		phoneDesc: "",
		companyName: "",
		amount: 0,
		network: "",
		body: "",
		display: "",
		platform: "",
		ram: "",
		mainCamera: "",
		selfieCamera: "",
		weight: "",
		battery: "",
		others: "",
		sellerId: globalUser.userName,
	};

	// Controlling loading button
	const [loadingBtn, setLoadingBtn] = useState(false);
	// Controlling form inputs
	const [values, handleFormChange, reset] = useFormInputState(initialFormValue);

	//handling the post request
	const handlePostSmartphoneRequest = async (Data) => {
		try {
			const postReq = axios.post("http://localhost:8080/smartphone/add", Data);
			await postReq;
			setSuccessReq(true);
			setLoadingBtn(false);
		} catch (err) {
			console.log(err);
			console.log("Error while sending post request to server");
			setSuccessReq(false);
		}
		setLoadingBtn(false);
		// Opening the snackbar after submitting
		setSnackOpen(true);
	};

	//To store and view image uploaded on the page
	var img;

	const handleImageUpload = (e) => {
		var fileInput = document.getElementById("img");
		var file = fileInput.files[0];
		var reader = new FileReader();
		var fileDisplay = document.getElementById("fileDisplay");
		var photoDiv = document.getElementById("upload-photo-div");
		reader.onload = function(e) {
			fileDisplay.innerHTML = "";

			img = new Image();
			img.src = reader.result;

			//storing src of the image in our form values
			values.img = img.src;
			img.height = 120;
			img.width = 120;

			//To show image selected on the page
			fileDisplay.appendChild(img);
			photoDiv.style.marginTop = "0em";
		};

		reader.readAsDataURL(file);
	};

	//Handling submit request
	const handleSubmit = (evt) => {
		evt.preventDefault();
		setLoadingBtn(true);
		handlePostSmartphoneRequest(values);
		reset(initialFormValue);
		var fileDisplay = document.getElementById("fileDisplay");
		var photoDiv = document.getElementById("upload-photo-div");
		fileDisplay.innerHTML = "";
		photoDiv.style.marginTop = "3em";
	};

	// Handling the submit button disable when no value is entered
	const [disableSubmit, setDisableSubmit] = useState(true);
	// Checking whenever data is re rendered
	useEffect(() => {
		for (let formKeys in values) {
			if (values[formKeys] === "") {
				setDisableSubmit(true);
				return;
			}
		}
		setDisableSubmit(false);
	}, [values]);

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
				<Grid item xs={10} ml={matches ? "8%" : "15%"} align={"center"}>
					{/* Topbar opens if sidebar is closed in smaller screens */}
					<TopBar
						matches={matches}
						open={open}
						handleDrawerOpen={handleDrawerOpen}
					/>

					<Box mt={0} mr={2} ml={2} width={"100%"}>
						<Paper
							sx={{
								paddingRight: "5%",
								paddingLeft: "5%",
								minHeight: "100vh",
								paddingTop: "1rem",
								paddingBottom: "2rem",
							}}
							elevation={0}
							style={{
								backgroundColor: "rgba(242, 242, 242,0.3)",
							}}
						>
							{/* Displaying seller information */}
							<Grid container spacing={1} paddingTop={3}>
								<Grid item xs={2}>
									<Typography
										component="div"
										variant="body1"
										fontWeight={"700"}
									>
										{globalUser.name}
									</Typography>
									<Typography
										variant="subtitle2"
										color="text.secondary"
										component="div"
									>
										{globalUser.city}
									</Typography>
									<Rating
										name="seller-rating"
										defaultValue={4}
										precision={0.5}
										readOnly
										size="small"
										sx={{ marginTop: "0.5em" }}
									/>
								</Grid>
								<Grid item xs={8}>
									<h6 className="providePhoneSpecs">
										Enter Smartphone details{" "}
										<Icon sx={{ marginLeft: "0.7rem" }}>
											<BorderColorIcon />
										</Icon>
									</h6>
								</Grid>
							</Grid>

							{/* Form to take inputs of smartphone details */}
							<form autoComplete="off" onSubmit={handleSubmit}>
								<Grid container spacing={2}>
									<Grid item xs={3}>
										<TextField
											name="phoneName"
											variant="outlined"
											label="Smartphone Name"
											placeholder="Enter the name of Smartphone"
											value={values.phoneName}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="companyName"
											variant="outlined"
											label="Company Name"
											placeholder="Enter the company name of Smartphone"
											value={values.companyName}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="amount"
											variant="outlined"
											label="Price"
											placeholder="Enter the smartphone price in Rs."
											value={values.amount}
											fullWidth
											type="number"
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="availability"
											variant="outlined"
											label="Smartphone Availability"
											placeholder="Enter the total items available"
											value={values.availability}
											fullWidth
											onChange={handleFormChange}
											type="number"
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
								</Grid>
								<Grid container mt={3} spacing={2} mb={2}>
									<Grid item xs={6}>
										<TextField
											name="phoneDesc"
											variant="outlined"
											label="Smartphone Description"
											placeholder="Enter the smartphone description"
											value={values.phoneDesc}
											fullWidth
											onChange={handleFormChange}
											multiline
											rows={5}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>

									<Grid item xs={4}>
										<div id="upload-photo-div" style={{ marginTop: "3em" }}>
											<label htmlFor="img">
												<input
													style={{ display: "none" }}
													id="img"
													name="img"
													type="file"
													onChange={handleImageUpload}
												/>

												<Fab
													color="primary"
													size="small"
													component="span"
													aria-label="add"
													variant="extended"
													sx={{ paddingRight: "1em" }}
												>
													<AddIcon /> Upload photo
												</Fab>
												{/* Image is displayed here when uploaded */}
												<div
													style={{ marginTop: "1em" }}
													id="fileDisplay"
												></div>
											</label>
										</div>
									</Grid>
								</Grid>
								<h6 className="providePhoneSpecs">
									Provide Smartphone Specifications
									<Icon sx={{ marginLeft: "0.7rem" }}>
										<LibraryBooksIcon />
									</Icon>
								</h6>
								<Grid container spacing={2} mb={3}>
									<Grid item xs={3}>
										<TextField
											name="network"
											variant="outlined"
											label="Network"
											placeholder="Enter the network specs"
											value={values.network}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="body"
											variant="outlined"
											label="Body"
											placeholder="Enter the body specs"
											value={values.body}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="display"
											variant="outlined"
											label="Display"
											placeholder="Enter the display specs"
											value={values.display}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="platform"
											variant="outlined"
											label="Platform"
											placeholder="Enter the platform of smartphone"
											value={values.platform}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2} mb={3}>
									<Grid item xs={3}>
										<TextField
											name="ram"
											variant="outlined"
											label="RAM"
											placeholder="Enter the RAM"
											value={values.ram}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="mainCamera"
											variant="outlined"
											label="Main Camera"
											placeholder="Enter the Main Camera specs"
											value={values.mainCamera}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="selfieCamera"
											variant="outlined"
											label="Selfie Camera"
											placeholder="Enter the Selfie Camera specs"
											value={values.selfieCamera}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											name="weight"
											variant="outlined"
											label="Weight"
											placeholder="Enter the Weight specs"
											value={values.weight}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2} mb={3}>
									<Grid item xs={3}>
										<TextField
											name="battery"
											variant="outlined"
											label="Battery"
											placeholder="Enter the Battery specs"
											value={values.battery}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
									<Grid item xs={9}>
										<TextField
											name="others"
											variant="outlined"
											label="Others"
											placeholder="Enter More specifications"
											value={values.others}
											fullWidth
											onChange={handleFormChange}
											sx={{
												backgroundColor: "white",
											}}
										/>
									</Grid>
								</Grid>
								{/* Go to Homepage and post a smartphone buttons */}
								<Stack
									spacing={10}
									direction="row"
									marginTop="2rem"
									justifyContent="center"
									alignItems="center"
								>
									<Button
										variant="contained"
										sx={{
											"& a": {
												color: "white",
											},
										}}
									>
										<Link
											to="/homePage"
											style={{
												textDecoration: "none",
											}}
										>
											Go Back
										</Link>
									</Button>
									<LoadingButton
										variant="contained"
										type="submit"
										loading={loadingBtn}
										disabled={disableSubmit}
									>
										Post Smartphone
									</LoadingButton>
								</Stack>
							</form>
							{/* Snackbar to see alert */}
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
									<SnackbarAlert
										onClose={handleSnackBarClick}
										severity="success"
									>
										Phone posted successfully!
									</SnackbarAlert>
								) : (
									<SnackbarAlert onClose={handleSnackBarClick} severity="error">
										Error posting phone!
									</SnackbarAlert>
								)}
							</Snackbar>
						</Paper>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
export default PostSmartphone;
