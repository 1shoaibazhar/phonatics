import React, { useEffect, useState } from "react";
import useInputState from "../hooks/useInputState";
import axios from "axios";
import { TextField } from "@mui/material";

//To test if the email is correct or not
function emailTestFunc(emailVal) {
	return new Promise((resolve, reject) => {
		let emailAPIReq = async () => {
			let res = await axios.get(
				`https://emailvalidation.abstractapi.com/v1/?api_key=0b351dcbac4547eaa6fd61ba3a74ed83&email=${emailVal}`
			);
			if (res.data.deliverability !== "DELIVERABLE") {
				resolve(false);
			} else {
				resolve(true);
			}
		};
		emailAPIReq();
	});
}

//For editing a data column
function EditField({ field, value, editField, toggleEditForm }) {
	const [val, handleChange, reset] = useInputState(value);
	const [errorHandle, setError] = useState(false);
	const [errorMsg, setMsg] = useState("");

	//validation checks, will be checked for each entered character
	useEffect(() => {
		if (field === "name") {
			let letter = /^[a-z0-9 ,.'-]+$/i;
			setError(!letter.test(val));
			if (errorHandle === true) {
				setMsg("Invalid Name");
			} else {
				setMsg("");
			}
		} else if (field === "email") {
			let email = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
			setError(!email.test(val));
			if (errorHandle === true) {
				setMsg("Invalid Email");
			} else {
				setMsg("");
			}
		} else if (field === "password") {
			let pass = /^\S*$/;
			if (val.length < 6) {
				setError(true);
				if (errorHandle === true) {
					setMsg("Length of Password should not be less than 6");
				}
			} else if (!pass.test(val)) {
				setError(true);
				if (errorHandle === true) {
					setMsg("Password cannot contain white spaces");
				}
			} else {
				setError(false);
				setMsg("");
			}
		}
	}, [field, val, errorHandle]);

	//Handling submit on a single editable field
	const handleSubmit = (e) => {
		e.preventDefault();
		if (field === "email") {
			async function validityCheck() {
				const validity = await emailTestFunc(val);
				console.log(validity);
				if (validity === false) {
				} else {
					editField(field, val);
					reset();
					toggleEditForm();
				}
			}
			validityCheck();
		} else {
			editField(field, val);
			reset();
			toggleEditForm();
		}
	};
	const showErr = (e) => {
		e.preventDefault();
		console.log("Error");
	};
	return (
		<form
			onSubmit={errorHandle ? showErr : handleSubmit}
			style={{ marginLeft: "0rem", width: "100%" }}
		>
			<TextField
				value={val}
				onChange={handleChange}
				fullWidth
				autoFocus
				id="outlined-basic"
				variant="standard"
				label={field.toUpperCase()}
				required
				error={errorHandle}
				helperText={errorMsg}
				size="small"
			/>
		</form>
	);
}
export default EditField;
