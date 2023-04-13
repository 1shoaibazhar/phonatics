import React, { useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { stringAvatar } from "../../helpers/avatar";
import { useGlobalUser } from "../../contexts/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import InfoField from "../InfoField";
import {
	Paper,
	Stack,
	Button,
	List,
	Grid,
	Typography,
	Avatar,
	Box,
	Snackbar,
	Alert,
	Radio,
	RadioGroup,
	FormControlLabel,
	useMediaQuery,
} from "@mui/material";

//Component to Manage user's information i.e. view and edit information
function UserInfo() {
	const { globalUser, setGlobalUser } = useGlobalUser();
	const [editOpen, setEditOpen] = useState(false);

	const [info, setInfo] = useState(globalUser);

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("lg"));
	//info state is updated
	const editField = (field, value) => {
		setInfo({
			...info,
			[field]: value,
		});
	};

	const [successReq, setSuccessReq] = useState(false);

	// Updating data call
	const updatePostRequest = async () => {
		// Logic for update call
		try {
			// API call here
			await axios.put("http://localhost:8080/users/update", info);

			setSuccessReq(true);
			setGlobalUser(info);
			Cookies.set("globalUserCookie", JSON.stringify(info), {
				expires: 1,
				sameSite: "Lax",
				secure: true,
			});
		} catch (err) {
			console.log(err);
			setSuccessReq(false);
		}
		setSnackOpen(true);
	};

	// Code for snackbar implementation

	const [snackOpen, setSnackOpen] = useState(false);

	const handleSnackBarClick = (evt, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackOpen(false);
	};

	const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
		return <Alert elevation={6} ref={ref} {...props} />;
	});

	const handleClick = () => {
		updatePostRequest();
	};
	const handleTypeChange = (e) => {
		editField("type", e.target.value);
	};
	return (
		<Box
			style={{
				backgroundImage: "url(" + require("../../images/phone2.jpg") + ")",
				backgroundPosition: "center",
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				height: "100vh",
			}}
		>
			{/* if data is not available */}
			{Object.keys(info).length === 0 ? (
				<>
					<Box
						sx={{
							padding: "17rem 4rem 5rem 4rem",
						}}
					>
						<Snackbar
							open={true}
							autoHideDuration={3000}
							anchorOrigin={{
								vertical: "top",
								horizontal: "center",
							}}
						>
							<SnackbarAlert severity="error">
								Error Loading Data!
							</SnackbarAlert>
						</Snackbar>
					</Box>
					<Box>
						<Typography
							variant="h4"
							style={{
								marginLeft: "2rem",
								fontFamily: "PT Sans, sans-serif",
								color: "white",
								fontWeight: "bold",
							}}
						>
							PURCHASE YOUR FAVORITE
						</Typography>
						<Typography
							variant="h4"
							style={{
								marginLeft: "2rem",
								fontFamily: "PT Sans, sans-serif",
								color: "white",
								fontWeight: "bold",
							}}
						>
							SMARTPHONES AND GET REVIEWS
						</Typography>
						<Button
							variant="contained"
							sx={{
								"& a": {
									color: "white",
								},
								marginLeft: "15rem",
								marginTop: "1rem",
							}}
							color="secondary"
						>
							<Link to="/homePage" style={{ textDecoration: "none" }}>
								Go Back
							</Link>
						</Button>
					</Box>
				</>
			) : (
				// If data is available
				<Grid container>
					<Grid item xs={12} lg={7.5}>
						<Typography
							variant="h4"
							style={{
								marginTop: "20rem",
								marginLeft: "2rem",
								fontFamily: "PT Sans, sans-serif",
								color: "white",
								fontWeight: "bold",
							}}
						>
							PURCHASE YOUR FAVORITE
						</Typography>
						<Typography
							variant="h4"
							style={{
								marginLeft: "2rem",
								fontFamily: "PT Sans, sans-serif",
								color: "white",
								fontWeight: "bold",
							}}
						>
							SMARTPHONES AND GET REVIEWS
						</Typography>
					</Grid>
					<Grid item xs={12} lg={4.5} align="right">
						<Paper
							sx={{
								paddingRight: "5%",
								paddingLeft: "5%",
								minHeight: "97.5vh",
								paddingTop: "3%",
								marginBottom: "0",
							}}
							width={matches === true ? "100%" : "65%"}
							elevation={0}
						>
							<Grid container justifyContent="center">
								<Grid item xs={12} align="left">
									<Stack
										direction="row"
										spacing={3}
										sx={{
											marginTop: "4rem",
											marginLeft: "2.5rem",
										}}
									>
										<Avatar variant="rounded" {...stringAvatar(info.name)} />
										<Typography variant="h4">Profile Information</Typography>
									</Stack>
									<Stack
										sx={{
											marginLeft: "2.5rem",
											marginTop: "2rem",
										}}
									>
										<Typography
											sx={{
												fontSize: "18px",
											}}
										>
											<span style={{ fontWeight: "bold" }}>Username :</span>{" "}
											{info.userName}
										</Typography>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<List>
										<InfoField
											field="name"
											value={info.name}
											editField={editField}
											label="Name"
											setEditOpen={setEditOpen}
										/>
										<InfoField
											field="email"
											value={info.email}
											editField={editField}
											label="Email"
											setEditOpen={setEditOpen}
										/>
										<InfoField
											field="password"
											value={info.password}
											editField={editField}
											label="Password"
											setEditOpen={setEditOpen}
										/>

										<InfoField
											field="city"
											value={info.city}
											editField={editField}
											label="City"
											setEditOpen={setEditOpen}
										/>
										<RadioGroup
											aria-labelledby="type"
											defaultValue={info.type}
											name="type"
											row
											onChange={handleTypeChange}
											value={info.type}
											style={{ marginLeft: "30%" }}
										>
											<FormControlLabel
												value="seller"
												control={<Radio size="small" />}
												label="Seller"
											/>
											<FormControlLabel
												value="buyer"
												control={<Radio size="small" />}
												label="Buyer"
											/>
										</RadioGroup>
									</List>
									{/* Buttons to Update information or go back */}
									<Stack
										spacing={10}
										direction="row"
										marginTop="0.3rem"
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
											<Link to="/homePage" style={{ textDecoration: "none" }}>
												Go Back
											</Link>
										</Button>
										<LoadingButton
											onClick={handleClick}
											variant="contained"
											loading={false}
											disabled={editOpen}
										>
											Update
										</LoadingButton>
									</Stack>
								</Grid>
							</Grid>
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
										Data Updated successfully!
									</SnackbarAlert>
								) : (
									<SnackbarAlert onClose={handleSnackBarClick} severity="error">
										Error updating data!
									</SnackbarAlert>
								)}
							</Snackbar>
						</Paper>
					</Grid>
				</Grid>
			)}
		</Box>
	);
}
export default UserInfo;
