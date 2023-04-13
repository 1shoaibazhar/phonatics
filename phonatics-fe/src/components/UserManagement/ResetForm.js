import React, { useState, forwardRef, useEffect } from "react";
import useFormInputState from "../../hooks/useFormInputState";
import axios from "axios";
import testError from "../../helpers/testError";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { useGlobalUser } from "../../contexts/UserContext";
import { LoadingButton } from "@mui/lab";
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
import AccountBoxSharpIcon from "@mui/icons-material/AccountBoxSharp";

//Component to reset the password
function ResetForm({ setpswPage }) {
	// Using the global context state
	const { globalUser, setGlobalUser } = useGlobalUser();

	// Object of current user containing password
	let userObj = globalUser;

	// Controlling loading button
	const [loadingBtn, setLoadingBtn] = useState(false);

	const initialFormValue = {
		newPassword: "",
	};

	// Controlling form inputs
	const [values, handleFormChange, reset] = useFormInputState(initialFormValue);

	//Handling reset password request
	const handlePostResetPasswordRequest = async () => {
		setLoadingBtn(true);
		try {
			let tmpObj = {
				id: userObj.id,
				name: userObj.name,
				email: userObj.email,
				userName: userObj.userName,
				password: values.newPassword,
				city: userObj.city,
				type: userObj.type,
			};
			const resetReq = await axios.post(
				"http://localhost:8080/users/resetPass",
				tmpObj
			);
			console.log(resetReq);
			setGlobalUser(userObj);
			console.log("Password reset successfully");
			setTimeout(() => setpswPage(0), 2000);
			setLoadingBtn(false);
			setFormValid(1);
		} catch {
			console.log(
				"Error while sending sending new password request to server, RESET REQUEST"
			);
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
					newPassword: false,
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
				if (values.newPassword === userObj.password) {
					console.log("New password is same as old password");
					setFormValid(4);
				} else {
					console.log("Posted data = ", JSON.stringify(values));
					handlePostResetPasswordRequest();
					reset(initialFormValue);
				}
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
						align="center"
					>
						Enter your new Password
					</Typography>
					<Tooltip
						title="Enter a password with atleast six characters and no spaces "
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<TextField
							variant="standard"
							label="Password"
							name="newPassword"
							placeholder="Enter your new Password"
							value={values.newPassword}
							fullWidth
							error={invalidDataEntry.newPassword}
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
						marginRight: 2,
					}}
				>
					<span
						style={{
							fontSize: "15px",
							fontWeight: "bold",
						}}
					>
						Note:{" "}
					</span>{" "}
					New password and old password shouldn't be same{" "}
				</Typography>
			</Stack>
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
								Password reset successfully
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
							New password cannot be same as old password
						</SnackBarAlert>
					) : null}
				</Snackbar>
			) : null}
		</Paper>
	);
}

export default ResetForm;
