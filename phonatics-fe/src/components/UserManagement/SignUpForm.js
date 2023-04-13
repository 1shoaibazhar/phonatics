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
	Tooltip,
	Chip,
	Snackbar,
	Alert,
	Radio,
	RadioGroup,
	FormControlLabel,
} from "@mui/material";
import AccountBoxSharpIcon from "@mui/icons-material/AccountBoxSharp";

function SignUpForm({ setPage }) {
	// Controlling loading button
	const [loadingBtn, setLoadingBtn] = useState(false);

	const initialFormValue = {
		name: "",
		email: "",
		userName: "",
		password: "",
		type: "",
		city: "",
	};

	// Controlling form inputs
	const [values, handleFormChange, reset] = useFormInputState(initialFormValue);

	const handlePostSignUpRequest = async (Data) => {
		try {
			console.log(Data);
			const postReq = axios.post("http://localhost:8080/users/add", Data);
			await postReq;
			console.log(postReq);
			setLoadingBtn(false);
			setFormValid(1);
			setTimeout(() => {
				setPage("2");
			}, 800);
		} catch (err) {
			if (err.response.status === 409) {
				console.log("Username already exists");
				console.log(err);
				setFormValid(4);
			} else {
				console.log(err);
				console.log("Error while sending post request to server");
				setFormValid(3);
			}
			setLoadingBtn(false);
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
					name: "",
					email: "",
					userName: "",
					password: "",
					type: "",
					city: "",
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
		setLoadingBtn(true);
		validateForm(values).then((res) => {
			if (res === true) {
				handlePostSignUpRequest(values);
				reset(initialFormValue);
			} else {
				console.log("Request not submitted, error in form data");
				setLoadingBtn(false);
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

	// Handling the the Already Have An Account Chip
	// Adding handler for reset chip click
	const handleHaveAnAccountClick = (e) => {
		setPage("2");
	};

	return (
		<Paper
			sx={{
				paddingRight: "20%",
				paddingLeft: "20%",
				minHeight: "100%",
				width: "38%",
				paddingTop: "6rem",
				paddingBottom: "3%",
				overflow: "hidden",
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
						Sign Up
					</Typography>
					<Tooltip
						title="Enter your name or your store's name"
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<TextField
							name="name"
							variant="standard"
							label="Name"
							placeholder="Enter your Name or your Store's name"
							value={values.name}
							fullWidth
							error={invalidDataEntry.name}
							onChange={handleFormChange}
						/>
					</Tooltip>
					<Tooltip
						title="Enter a valid email like : example@gmail.com"
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<TextField
							variant="standard"
							label="Email"
							name="email"
							placeholder="Enter your Email"
							value={values.email}
							fullWidth
							error={invalidDataEntry.email}
							onChange={handleFormChange}
						/>
					</Tooltip>
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
					<Tooltip
						title="Enter your city e.g. Islamabad"
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<TextField
							variant="standard"
							label="City"
							name="city"
							type="city"
							placeholder="Enter your City"
							value={values.city}
							fullWidth
							error={invalidDataEntry.city}
							onChange={handleFormChange}
						/>
					</Tooltip>

					<RadioGroup
						aria-labelledby="type"
						defaultValue="Seller"
						name="type"
						row
						onChange={handleFormChange}
						value={values.type}
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

					<LoadingButton
						type="submit"
						variant="contained"
						loading={loadingBtn}
						disabled={disableSubmit}
						fullWidth
					>
						Submit
					</LoadingButton>
					<Stack
						direction="row"
						spacing={1}
						sx={{
							mt: 4,
							ml: 4,
						}}
					>
						<Typography
							style={{
								marginTop: "0.2rem",
								fontWeight: "bold",
							}}
							variant="body2"
						>
							Already have an account?
						</Typography>
						<Chip
							label="Sign In"
							color="primary"
							size="small"
							onClick={handleHaveAnAccountClick}
						/>
					</Stack>
				</Stack>
			</form>
			{/* Snackbar to show alerts */}
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
							Signed Up successfully!
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
							Username already exists
						</SnackBarAlert>
					) : null}
				</Snackbar>
			) : null}
		</Paper>
	);
}

export default SignUpForm;
