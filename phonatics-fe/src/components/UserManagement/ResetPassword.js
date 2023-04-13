import React, { useState, forwardRef, useEffect } from "react";
import useFormInputState from "../../hooks/useFormInputState";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import testError from "../../helpers/testError";

import {
	Paper,
	Typography,
	Stack,
	TextField,
	Avatar,
	Button,
	Tooltip,
	Snackbar,
	Alert,
} from "@mui/material";
//Icons
import AccountBoxSharpIcon from "@mui/icons-material/AccountBoxSharp";
import AnnouncementIcon from "@mui/icons-material/Announcement";

//Component to reset password, A temporary password is received on the provided email, using which the user can reset password
function ResetPassword({ setpswPage }) {
	// Controlling loading button
	const [loadingBtn, setLoadingBtn] = useState(false);

	const initialFormValue = {
		userName: "",
	};

	// Controlling form inputs
	const [values, handleFormChange, reset] = useFormInputState(initialFormValue);

	const handlePostResetPasswordRequest = async (Data) => {
		setLoadingBtn(true);
		try {
			const reqString = `http://localhost:8080/users/tempPass`;
			let resetReq = await axios.post(reqString, { userName: Data.userName });
			console.log(resetReq);

			if (resetReq.data === "User not found") {
				console.log("Username doesn't exist");
				setFormValid(4);
			} else {
				console.log("Reset password request sent successfully");
				setTimeout(() => setpswPage(0), 3000);
				setFormValid(1);
			}
			setLoadingBtn(false);
		} catch {
			console.log("Error while sending post request to server, RESET REQUEST");
			setLoadingBtn(false);
			setFormValid(3);
		}
	};

	// Validating the form
	const [formValid, setFormValid] = useState(0);

	// Using a state to detect invalid entered data
	const [invalidDataEntry, setInvalidDataEntry] = useState({});

	const validateForm = async (dataTest) => {
		return new Promise((resolve, reject) => {
			async function nestValidate() {
				const validData = {
					userName: false,
				};
				const errorinData = await testError(dataTest, validData);
				setInvalidDataEntry(errorinData);

				// If any error of the form data entered is true (means error exists), return false
				for (let valueofData in errorinData) {
					if (errorinData[valueofData]) {
						console.log(errorinData);
						resolve(false);
					}
				}
				resolve(true);
			}
			nestValidate();
		});
	};

	//   Handling submit request
	const handleSubmit = (evt) => {
		evt.preventDefault();

		validateForm(values).then((res) => {
			if (res === true) {
				console.log("Posted data = ", JSON.stringify(values));
				handlePostResetPasswordRequest(values);
				reset(initialFormValue);
			} else {
				console.log("Request not submitted, error in form data");
				setFormValid(2);
			}
			// Opening the snackbar after submitting
			setSnackOpen(true);
		});
	};

	// Handling the submit button disable when no value is entered
	const [disableSubmit, setDisableSubmit] = useState(true);
	// Checking whenever data is re rendered
	useEffect(
		() => {
			for (let formKeys in values) {
				if (values[formKeys] === "") {
					setDisableSubmit(true);
					return;
				}
			}
			setDisableSubmit(false);
			setFormValid(0);
		},
		[values],
		[formValid]
	);

	// SnackBar for displaying sucess or error in form submission
	const [snackOpen, setSnackOpen] = useState(false);
	const handleSnackClose = (evt, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackOpen(false);
	};

	// Custom snackbar
	const SnackBarAlert = forwardRef(function SnackBarAlert(props, ref) {
		return <Alert elevation={6} ref={ref} {...props} />;
	});

	return (
		<Paper
			sx={{
				paddingRight: "20%",
				paddingLeft: "20%",
				minHeight: "calc(100vh - 20%)",
				width: "38%",
				paddingTop: "6rem",
				paddingBottom: "5rem",
				overflow: "hidden",
				overscrollBehavior: "contain",
				scroll: "no",
			}}
			elevation={5}
		>
			<form autoComplete="off" onSubmit={handleSubmit} noValidate>
				<Stack spacing={2} direction="column" alignItems="center">
					<Avatar sx={{ bgcolor: "success.light" }}>
						<AccountBoxSharpIcon />
					</Avatar>
					<Typography
						variant="h5"
						style={{
							fontWeight: "bold",
							fontSize: "30px",
						}}
					>
						Reset Password
					</Typography>
					<Tooltip
						title="Enter a valid username like : iamexample123"
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<TextField
							variant="standard"
							label="User Name"
							name="userName"
							placeholder="Enter your User Name"
							value={values.userName}
							fullWidth
							error={invalidDataEntry.userName}
							onChange={handleFormChange}
						/>
					</Tooltip>
					<Stack spacing={6} direction="row">
						<Button variant="outlined" onClick={() => setpswPage(0)}>
							Cancel
						</Button>
						<LoadingButton
							type="submit"
							variant="contained"
							loading={loadingBtn}
							disabled={disableSubmit}
						>
							Submit
						</LoadingButton>
					</Stack>
				</Stack>
			</form>

			<Stack direction="row">
				<AnnouncementIcon
					style={{
						marginTop: "1.5rem",
					}}
				/>
				<Typography
					variant="body2"
					align="center"
					sx={{
						marginTop: 3,
					}}
				>
					<span
						style={{
							fontSize: "15px",
							fontWeight: "bold",
						}}
					>
						{" "}
						Note:{" "}
					</span>{" "}
					You will be sent a temporary password on your registered email address
					that will be valid for 1 Hour!{" "}
				</Typography>
			</Stack>
			{/* Snackbar for alerts */}
			{formValid !== 0 ? (
				<Snackbar
					autoHideDuration={2000}
					open={snackOpen}
					onClose={handleSnackClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					sx={{
						marginRight: "4rem",
						marginBottom: "3rem",
					}}
				>
					{formValid === 1 ? (
						<div>
							<SnackBarAlert onClose={handleSnackClose} severity="success">
								Reset password request submitted successfully!
							</SnackBarAlert>
						</div>
					) : formValid === 2 ? (
						<SnackBarAlert onClose={handleSnackClose} severity="warning">
							Invalid Data entered
						</SnackBarAlert>
					) : formValid === 3 ? (
						<SnackBarAlert onClose={handleSnackClose} severity="error">
							Unable to connect to server
						</SnackBarAlert>
					) : formValid === 4 ? (
						<SnackBarAlert onClose={handleSnackClose} severity="error">
							Invalid username entered
						</SnackBarAlert>
					) : null}
				</Snackbar>
			) : null}
		</Paper>
	);
}

export default ResetPassword;
