import React, { useState, useEffect } from "react";
import "../../css/styles.css";
import Sidebar from "../NavBars/Sidebar";
import TopBar from "../NavBars/TopBar";
import useFormInputState from "../../hooks/useFormInputState";
import DeleteSmartphoneDialog from "../../helpers/DeleteSmartphoneDialog";
import { useGlobalSmartphones } from "../../contexts/SmartphonesContext";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
// Icons
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

//This component is for seller to manage the smartphone information i.e.
//View information of the selected smartphone, edit its information and delete a smartphone
function ManageSmartphone() {
	const navigate = useNavigate();

	const { clickedSmartphone, deletePhone } = useGlobalSmartphones();

	//states for side drawer
	const [open, setOpen] = useState(false);
	//matches is true when screen size is less than medium
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};
	//delete dialog state
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	let phone = { ...clickedSmartphone };
	//Adding features separately in the phone object
	const features = phone.features;
	delete phone["features"];
	phone = { ...phone, ...features };

	// Controlling loading button
	const [loadingBtn, setLoadingBtn] = useState(false);

	// Controlling form inputs
	const [values, handleFormChange, reset] = useFormInputState(phone);

	const handleUpdateSmartphoneRequest = async (Data) => {
		console.log("Updating phone");
		console.log(Data);
		try {
			const putReq = axios.put("http://localhost:8080/smartphone/update", Data);
			await putReq;
			console.log(putReq);
			setLoadingBtn(false);
			setTimeout(() => {
				navigate("/my-smartphones");
			}, 500);
		} catch (err) {
			console.log(err);
			console.log("Error while sending update request to server");
		}
		setLoadingBtn(false);
	};

	const handleDeleteSmartphone = async () => {
		// API call for delete
		try {
			const delReq = axios.post("http://localhost:8080/smartphone/delete", {
				phoneID: phone.phoneID,
			});
			await delReq;
			setTimeout(() => {
				navigate("/my-smartphones");
			}, 500);
			deletePhone(phone);
		} catch (err) {
			console.log(err);
			console.log("Error while sending delete request to server");
		}
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		setLoadingBtn(true);
		handleUpdateSmartphoneRequest(values);
		reset(phone);
	};

	//Function for handling the image upload by creating an img object and displaying and storing it
	var img;
	const handleImageUpload = (e) => {
		var fileInput = document.getElementById("img");
		var fileDisplay = document.getElementById("fileDisplay");
		var file = fileInput.files[0];
		var reader = new FileReader();

		reader.onload = function(e) {
			fileDisplay.innerHTML = "";

			img = new Image();
			img.src = reader.result;
			values.img = img.src;
			img.height = 120;
			img.width = 120;
			fileDisplay.appendChild(img);
		};

		reader.readAsDataURL(file);
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
					{/* When smaller than medium screen so sidebar is closed and we use the top bar to open it if required */}
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
							{/* Seller Information */}
							<Grid container spacing={1} paddingTop={3}>
								<Grid item xs={2}>
									<Typography
										component="div"
										variant="body1"
										fontWeight={"700"}
									>
										{phone.seller}
									</Typography>
									<Typography
										variant="subtitle2"
										color="text.secondary"
										component="div"
									>
										{phone.sellerLocation}
									</Typography>
									<Rating
										name="seller-rating"
										defaultValue={3}
										precision={0.5}
										readOnly
										size="small"
										sx={{ marginTop: "0.5em" }}
									/>
								</Grid>
								<Grid item xs={8}>
									<h6 className="providePhoneSpecs">
										Edit Smartphone details{" "}
										<Icon sx={{ marginLeft: "0.7rem" }}>
											<BorderColorIcon />
										</Icon>
									</h6>
								</Grid>
							</Grid>
							{/* View and Edit smartphone information */}
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
									<Grid item xs={8}>
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
										<div id="upload-photo-div" style={{ marginTop: "0em" }}>
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
													<AddIcon /> Change photo
												</Fab>
												<div style={{ marginTop: "1em" }} id="fileDisplay">
													<img
														src={values.img}
														height="120"
														width="120"
														alt="Smartphone"
													></img>
												</div>
											</label>
										</div>
									</Grid>
								</Grid>
								{/* Smartphone Specifications */}
								<h6 className="providePhoneSpecs">
									Edit Smartphone Specifications
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
								{/* Go Back to Home Page, Update smartphone details and the delete smartphone buttons */}
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
											Home Page
										</Link>
									</Button>
									<LoadingButton
										variant="contained"
										type="submit"
										loading={loadingBtn}
										disabled={disableSubmit}
										color="success"
									>
										Update Smartphone Details
									</LoadingButton>
									<Button
										variant="contained"
										onClick={() => setShowDeleteDialog(true)}
										color="error"
									>
										Delete Smartphone
									</Button>
								</Stack>
							</form>
						</Paper>
					</Box>
				</Grid>
			</Grid>
			{showDeleteDialog === true ? (
				<DeleteSmartphoneDialog
					setShowDeleteDialog={setShowDeleteDialog}
					showDeleteDialog={showDeleteDialog}
					handleDeleteSmartphone={handleDeleteSmartphone}
				/>
			) : null}
		</Box>
	);
}
export default ManageSmartphone;
