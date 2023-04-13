import React, { useEffect, useState } from "react";
import Sidebar from "../NavBars/Sidebar";
import SearchBar from "../SearchBar";
import {
	Stack,
	CircularProgress,
	Box,
	Grid,
	useMediaQuery,
} from "@mui/material";
import PostedSmartphone from "./PostedSmartphone";
import { useTheme } from "@mui/material/styles";
import "../../css/phonaticsName.css";
import TopBar from "../NavBars/TopBar";
import { useGlobalSmartphones } from "../../contexts/SmartphonesContext";
import axios from "axios";
import Cookies from "js-cookie";

// Component for seller to view their posted smartphones and then manage the smartphone details
function MySmartphones() {
	const {
		globalSmartphones,
		setGlobalSmartphones,
		setClickedSmartphone,
	} = useGlobalSmartphones();

	let globalUser = JSON.parse(Cookies.get("globalUserCookie"));

	useEffect(() => {
		const sellerUserName = globalUser.userName;
		setGlobalSmartphones([]);
		try {
			run();
			async function run() {
				let fetchPhones = await axios.get(
					`http://localhost:8080/smartPhone/getSellerPhones/${sellerUserName}`
				);
				setGlobalSmartphones([...fetchPhones.data]);
				setShowLoading(false);
			}
		} catch {
			setShowLoading(false);
		}
	}, []);

	const [open, setOpen] = useState(false);

	// Search for posted smartphones by their name
	const [searchQuery, setSearchQuery] = useState("");
	const [showLoading, setShowLoading] = useState(true);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleSearchPhones = () => {
		const sellerUserName = globalUser.userName;
		setGlobalSmartphones([]);
		try {
			run();
			async function run() {
				let fetchPhones = await axios.get(
					`http://localhost:8080/smartPhone/getSellerPhones/${sellerUserName}`
				);
				setGlobalSmartphones([...fetchPhones.data]);
				setGlobalSmartphones((globalSmartphones) => {
					const filteredPhones = globalSmartphones.filter((phone) =>
						phone.phoneName.toLowerCase().includes(searchQuery.toLowerCase())
					);
					return [...filteredPhones];
				});
				setShowLoading(false);
			}
		} catch {
			setShowLoading(false);
		}
	};

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));
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
				<Grid
					item
					xs={10}
					ml={matches ? "8%" : "20%"}
					sx={{ marginTop: "1.5em" }}
				>
					<Stack
						direction={{ xs: "column", md: "row" }}
						spacing={{ xs: 1.5, md: 2 }}
					>
						{/* When smaller than medium screen so sidebar is closed and we use the top bar to open it if required */}
						<TopBar
							matches={matches}
							open={open}
							handleDrawerOpen={handleDrawerOpen}
						/>

						<SearchBar
							setSearchQuery={setSearchQuery}
							searchQuery={searchQuery}
							text={"Search your posted smartphones"}
							setShowLoading={setShowLoading}
							handleSearchPhones={handleSearchPhones}
						/>
					</Stack>
					{showLoading && (
						<Box sx={{ margin: "15rem 30rem" }}>
							<CircularProgress />
						</Box>
					)}
					{globalSmartphones.map((phone, index) => (
						<PostedSmartphone
							phone={phone}
							key={index}
							btn="manage"
							setClickedSmartphone={setClickedSmartphone}
						/>
					))}
				</Grid>
			</Grid>
		</Box>
	);
}
export default MySmartphones;
