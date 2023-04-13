import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import Navbar from "../NavBars/Navbar";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import ResetPassword from "./ResetPassword";
import ResetForm from "./ResetForm";

// Component to handle te User Credentials page which renders other components like sign in, sign up
function UserCredentialPage() {
	// Hook to decide the opened page
	const [page, setPage] = useState("2");
	const [pswPage, setpswPage] = useState(0);
	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundImage: "url(" + require("../../images/phone.jpg") + ")",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center",
				overflow: "hidden",
				zIndex: "-1",
			}}
		>
			<Navbar setPage={setPage} page={page} setpswPage={setpswPage} />
			<Grid container>
				<Grid item xs={6} align="left">
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
						PURCHASE YOUR FAVORITE SMARTPHONES AND GET REVIEWS
					</Typography>
				</Grid>

				<Grid item xs={6} align="right">
					{pswPage === 1 ? (
						<ResetPassword setpswPage={setpswPage} />
					) : pswPage === 2 ? (
						<ResetForm setpswPage={setpswPage} />
					) : page === "1" ? (
						<SignUpForm setPage={setPage} />
					) : (
						<SignInForm setpswPage={setpswPage} setPage={setPage} />
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
export default UserCredentialPage;
