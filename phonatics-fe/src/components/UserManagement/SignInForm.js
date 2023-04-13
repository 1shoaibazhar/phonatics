import React, { useState, forwardRef, useEffect } from "react";
import useFormInputState from "../../hooks/useFormInputState";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import testError from "../../helpers/testError";
import { useGlobalUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
	Paper,
	Typography,
	Stack,
	TextField,
	Avatar,
	Tooltip,
	Snackbar,
	Alert,
} from "@mui/material";
import AccountBoxSharpIcon from "@mui/icons-material/AccountBoxSharp";

//Component of Sign In form and it sets a cookie
function SignInForm({ setpswPage }) {
	// Using the global context state
	const { setGlobalUser } = useGlobalUser();
	// Controlling loading button
	const [loadingBtn, setLoadingBtn] = useState(false);
	const navigate = useNavigate();
	const initialFormValue = {
		userName: "",
		password: "",
	};

	// Controlling form inputs
	const [values, handleFormChange, reset] = useFormInputState(initialFormValue);

	const handlePostSignInRequest = async (Data) => {
		setLoadingBtn(true);
		try {
			const postReq = await axios.post(
				"http://localhost:8080/users/authenticate",
				Data
			);
			console.log(postReq);
			if (postReq.data === "User not found") {
				// Logic for testing forget password

				console.log("Requesting temporary authentication");
				const postReq1 = await axios.post(
					"http://localhost:8080/users/authenticateTemp",
					Data
				);

				console.log(postReq1);
				if (postReq1.data !== "Temporary password not found") {
					setGlobalUser(postReq1.data);
					setFormValid(5);
					setTimeout(() => setpswPage(2), 2500);
				} else {
					setFormValid(4);
				}
			} else {
				setGlobalUser(postReq.data);
				setFormValid(1);
				Cookies.set("token", postReq.data.token, {
					expires: 5,
					sameSite: "Lax",
					secure: true,
				});
				Cookies.set("globalUserCookie", JSON.stringify(postReq.data), {
					expires: 5,
					sameSite: "Lax",
					secure: true,
				});
				console.log("Sign in req successfull");

				setTimeout(() => {
					navigate("/");
				}, 1000);
			}

			setLoadingBtn(false);
		} catch (err) {
			console.log(err);
			console.log("Error while sending post request to server, SIGN IN REQ");
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
					password: false,
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
				handlePostSignInRequest(values);
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

	// Adding handler for reset chip click
	const handleResetClick = (e) => {
		setpswPage(1);
	};

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
						Sign In
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
					<Tooltip
						title="Enter a valid password, atleast 6 characters long with no spaces!"
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<TextField
							variant="standard"
							label="Password"
							name="password"
							type="password"
							placeholder="Enter your Password"
							value={values.password}
							fullWidth
							error={invalidDataEntry.password}
							onChange={handleFormChange}
						/>
					</Tooltip>
					<Typography
						style={{
							marginTop: "4%",
							marginLeft: "42%",
							fontWeight: "bold",
							color: "blue",
							cursor: "pointer",
						}}
						variant="body2"
						onClick={handleResetClick}
					>
						Forgotten Password?
					</Typography>
					<LoadingButton
						type="submit"
						variant="contained"
						loading={loadingBtn}
						disabled={disableSubmit}
						fullWidth
					>
						Submit
					</LoadingButton>
				</Stack>
			</form>
			{/* Snackbar to show relevant alerts */}
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
						marginRight: "10rem",
						marginTop: "1rem",
					}}
				>
					{formValid === 1 ? (
						<SnackBarAlert onClose={handleSnackClose} severity="success">
							Signed In successfully!
						</SnackBarAlert>
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
							Invalid Username/Password entered!
						</SnackBarAlert>
					) : formValid === 5 ? (
						<SnackBarAlert onClose={handleSnackClose} severity="success">
							Redirecting to reset password page
						</SnackBarAlert>
					) : null}
				</Snackbar>
			) : null}
		</Paper>
	);
}

export default SignInForm;
