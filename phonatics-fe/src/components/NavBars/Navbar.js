import React from "react";
import { TabContext, TabList } from "@mui/lab";
import { Tab, AppBar, Toolbar, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Fade } from "react-reveal";
import SmartphoneIcon from "@mui/icons-material/Smartphone";

//NavBar component is used in the SignUp,SignIn,Reset Password pages on top
function NavBar({ page, setPage, setpswPage }) {
	//To shift between different pages of user credential
	const handleTabChange = (evt, value) => {
		setpswPage(0);
		setPage(value);
	};

	const handleOnClick = () => {
		setpswPage(0);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				sx={{
					background: "white",
					fontFamily: "Montserrat",
					height: "3.5rem",
				}}
				elevation={0}
			>
				<Toolbar
					sx={{
						marginLeft: "2.5rem",
					}}
				>
					<SmartphoneIcon
						style={{
							fontSize: "30px",
							color: "#090909ae",
							marginBottom: "0.3rem",
						}}
					/>
					<Fade left>
						<Link
							to="/"
							style={{
								textDecoration: "none",
							}}
						>
							<h3 className="heading2">Phonatics</h3>
						</Link>
					</Fade>
					<div style={{ flexGrow: 1 }}></div>
					<TabContext value={page}>
						<TabList
							aria-label="Tabs example"
							onChange={handleTabChange}
							onClick={handleOnClick}
							sx={{ mb: "0.3rem" }}
							TabIndicatorProps={{ style: { background: "black" } }}
						>
							<Tab
								label="Sign Up"
								value="1"
								sx={{
									color: "black",
									width: "17rem",
									fontWeight: "700",
								}}
							/>
							<Tab
								label="Sign In"
								value="2"
								sx={{
									color: "black",
									width: "17rem",
									fontWeight: "700",
								}}
							/>
						</TabList>
					</TabContext>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default NavBar;
