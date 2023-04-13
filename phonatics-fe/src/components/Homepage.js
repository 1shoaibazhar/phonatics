import React, { useState } from "react";
import "../css/phonaticsName.css";
import Sidebar from "./NavBars/Sidebar";
import SearchBar from "./SearchBar";
import TopBar from "./NavBars/TopBar";
import PostedSmartphone from "./Smartphone/PostedSmartphone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalCart } from "../contexts/CartItems";
import { useGlobalUser } from "../contexts/UserContext";
import { useGlobalSmartphones } from "../contexts/SmartphonesContext";
import { useTheme } from "@mui/material/styles";
import {
	Button,
	Stack,
	Tooltip,
	Box,
	Grid,
	useMediaQuery,
	Badge,
	CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect } from "react";

// Component of Home Page of Application where we have sidebar, sell option, analysis option and cart
// Seller and buyer can search for smartphones
function Homepage() {
	// Global Context
	const { CartTotalItems } = useGlobalCart();
	const { globalUser } = useGlobalUser();
	const {
		globalSmartphones,
		setGlobalSmartphones,
		setClickedSmartphone,
	} = useGlobalSmartphones();

	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	// storing the searched query of smartphone
	const [searchQuery, setSearchQuery] = useState("");

	const [showLoading, setShowLoading] = useState(true);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handlePostSmartphone = () => {
		setTimeout(() => {
			navigate("/post-smartphone");
		}, 500);
	};

	const handleCartClick = () => {
		setTimeout(() => {
			navigate("/cart");
		}, 500);
	};

	const handleSearchPhones = async () => {
		const tmpSearch = searchQuery;
		setGlobalSmartphones([]);
		try {
			let searchResult = await axios.get(
				`http://localhost:8080/smartPhone/getAll/${tmpSearch}`
			);
			setGlobalSmartphones([...searchResult.data]);
			setSearchQuery("");
		} catch (err) {
			console.log("Error while fetching search result");
		}
		setShowLoading(false);
	};

	const handleAnalysisButton = () => {
		setTimeout(() => {
			navigate("/specific-phoneAnalysis");
		}, 500);
	};

	// matches will be true when screen size is less than medium
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));
	let totalItemsInCart = CartTotalItems();

	useEffect(() => {
		setGlobalSmartphones([]);
		try {
			run();
			async function run() {
				let fetchPhones = await axios.get(
					"http://localhost:8080/smartPhone/getSomePhones"
				);
				setGlobalSmartphones([...fetchPhones.data]);
				setShowLoading(false);
			}
		} catch {
			setShowLoading(false);
		}
	}, []);

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
						{/* Topbar is added when screen size is smaller than medium to open and close sidebar */}
						<TopBar
							matches={matches}
							open={open}
							handleDrawerOpen={handleDrawerOpen}
						/>

						{/* SearchBar component to enter a smartphone name */}
						<SearchBar
							setSearchQuery={setSearchQuery}
							searchQuery={searchQuery}
							handleSearchPhones={handleSearchPhones}
							text={"Shop for new smartphones"}
							setShowLoading={setShowLoading}
						/>

						{/* If logged in user is not seller than Sell Smartphone option is disabled */}
						{globalUser.type !== "seller" ? (
							<Tooltip
								title="Create a seller account to avail this option"
								placement="left"
								arrow
								enterDelay={400}
								leaveDelay={200}
							>
								<Button
									variant="contained"
									sx={{
										textTransform: "none",
										backgroundColor: "GrayText",
										"&:hover": {
											cursor: "not-allowed",
											backgroundColor: "GrayText",
										},
									}}
									size="small"
								>
									Sell a Smartphone
								</Button>
							</Tooltip>
						) : (
							<Button
								variant="contained"
								sx={{
									textTransform: "none",
									backgroundColor: "dodgerblue",
								}}
								size="small"
								onClick={handlePostSmartphone}
							>
								Sell a Smartphone
							</Button>
						)}

						<Button
							variant="contained"
							sx={{
								textTransform: "none",
								backgroundColor: "dodgerblue",
							}}
							size="small"
							onClick={handleAnalysisButton}
						>
							Analysis of a Smartphone
						</Button>

						{/* Cart of a user */}
						{Object.keys(globalUser).length === 0 ? (
							<Tooltip
								title="Create an account to place order"
								placement="left"
								arrow
								enterDelay={400}
								leaveDelay={200}
							>
								<Button
									variant="outlined"
									size="small"
									sx={{
										backgroundColor: "whitesmoke",
										textTransform: "none",
										"&:hover": {
											cursor: "not-allowed",
											backgroundColor: "whitesmoke",
										},
									}}
									color="primary"
								>
									<Badge badgeContent={totalItemsInCart} color="primary">
										<ShoppingCartIcon />
									</Badge>
								</Button>
							</Tooltip>
						) : (
							<Button
								variant="outlined"
								size="small"
								sx={{
									backgroundColor: "whitesmoke",
								}}
								color="primary"
								onClick={handleCartClick}
							>
								<Badge badgeContent={totalItemsInCart} color="primary">
									<ShoppingCartIcon />
								</Badge>
							</Button>
						)}
					</Stack>
					{showLoading && (
						<Box sx={{ margin: "15rem 30rem" }}>
							<CircularProgress />
						</Box>
					)}
					{/* The fetched smartphones are mapped to Posted Smartphone component */}
					{globalSmartphones.map((phone, index) => (
						<PostedSmartphone
							phone={phone}
							key={index}
							btn="buy"
							setClickedSmartphone={setClickedSmartphone}
						/>
					))}
				</Grid>
			</Grid>
		</Box>
	);
}
export default Homepage;
