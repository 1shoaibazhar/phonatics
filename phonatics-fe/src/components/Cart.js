import React, { useState, forwardRef } from "react";
import "../css/phonaticsName.css";
import "../css/styles.css";
import PostedSmartphone from "./Smartphone/PostedSmartphone";
import Sidebar from "./NavBars/Sidebar";
import TopBar from "./NavBars/TopBar";
import PlaceOrder from "./PlaceOrder";
import { useGlobalCart } from "../contexts/CartItems";
import { useGlobalSmartphones } from "../contexts/SmartphonesContext";
import {
	Button,
	Stack,
	Box,
	Grid,
	useMediaQuery,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";

function Cart() {
	//matches is to check when screen size is less than medium so we can close the sidebar and have a topbar
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));

	const [showPlaceOrderDialog, setShowPlaceOrderDialog] = useState(false);
	//Drawers for when size of screen is small
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};

	//global cart context
	const { globalCart, setGlobalCart, CartAmount } = useGlobalCart();
	const { handlePhoneAvailability } = useGlobalSmartphones();

	const handleEmptyCart = () => {
		//Increasing the availability of global smartphones by phoneItems
		globalCart.map((phoneObj) => {
			for (let index = 0; index < phoneObj.phoneItems; index++) {
				handlePhoneAvailability(phoneObj, "increase");
			}
			return null;
		});

		//emptying the cart
		setGlobalCart((globalCart) => []);
	};
	const handleCheckout = () => {
		setShowPlaceOrderDialog(true);
	};
	let totalAmount = CartAmount() + 500; //500 is delivery fees

	// Snackbar code
	const [successReq, setSuccessReq] = useState(false);
	const [snackOpen, setSnackOpen] = useState(false);
	const handleSnackBarClick = (evt, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackOpen(false);
	};

	// Custom snackbar
	const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
		return <Alert elevation={6} ref={ref} {...props} />;
	});

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
				<Grid item xs={10} ml={matches ? "8%" : "15%"} align={"center"}>
					{/* When smaller than medium screen so sidebar is closed and we use the top bar to open it if required */}
					<TopBar
						matches={matches}
						open={open}
						handleDrawerOpen={handleDrawerOpen}
					/>
					{/* Headings */}
					<h6 className="cartInformationHeading">Items in Cart</h6>
					{globalCart.length === 0 && (
						<div>
							<h4>You have not picked any Smartphones yet</h4>
							<h4>
								Head on to the application and purchase your favorite one!
							</h4>
						</div>
					)}
					{/* Display objects placed in the Cart using PostedSmartphone component which is a card and btn=remove tells that
					this posted smartphone component is inside cart so we need remove button */}
					{globalCart.map((phone, index) => (
						<PostedSmartphone phone={phone} key={index} btn="remove" />
					))}
					{globalCart.length > 0 && (
						<div>
							<Typography
								variant="body1"
								sx={{ marginTop: "2rem", fontWeight: "bold" }}
							>
								Total Order Amount: {totalAmount}
							</Typography>
							<Typography
								variant="subtitle1"
								sx={{ marginTop: "1rem", fontWeight: "bold" }}
							>
								Delivery fees: Rs. 500 is added in total amount
							</Typography>
						</div>
					)}

					{/* Go Back to Home Page, Empty the cart and the Checkout buttons */}
					<Stack
						spacing={10}
						direction="row"
						marginTop="10rem"
						justifyContent="center"
						alignItems="center"
						marginBottom="2rem"
					>
						<Button
							variant="contained"
							sx={{
								"& a": {
									color: "white",
								},
							}}
						>
							<Link
								to="/homePage"
								style={{
									textDecoration: "none",
								}}
							>
								Go Back
							</Link>
						</Button>
						<LoadingButton
							variant="contained"
							onClick={handleEmptyCart}
							// loading={loadingBtn}
							disabled={globalCart.length === 0}
							color="error"
						>
							Empty Cart
						</LoadingButton>
						<LoadingButton
							variant="contained"
							onClick={handleCheckout}
							disabled={globalCart.length === 0}
							// loading={loadingBtn}
							color="success"
						>
							Checkout
						</LoadingButton>
					</Stack>
				</Grid>
			</Grid>
			{/* Showing the Place Order Dialog when user clicks checkout */}
			{showPlaceOrderDialog === true && (
				<PlaceOrder
					showPlaceOrderDialog={showPlaceOrderDialog}
					setShowPlaceOrderDialog={setShowPlaceOrderDialog}
					setSuccessReq={setSuccessReq}
					setSnackOpen={setSnackOpen}
					handleEmptyCart={handleEmptyCart}
				/>
			)}
			{/* Snackbar to Handle Alerts */}
			<Snackbar
				open={snackOpen}
				autoHideDuration={4000}
				onClose={handleSnackBarClick}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				{successReq === true ? (
					<SnackbarAlert onClose={handleSnackBarClick} severity="success">
						The Order has been placed. Will be delivered in 3-5 business days.
					</SnackbarAlert>
				) : (
					<SnackbarAlert onClose={handleSnackBarClick} severity="error">
						Error in placing order!
					</SnackbarAlert>
				)}
			</Snackbar>
		</Box>
	);
}
export default Cart;
