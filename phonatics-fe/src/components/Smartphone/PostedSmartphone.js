import React, { forwardRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useGlobalCart } from "../../contexts/CartItems";
import { useGlobalSmartphones } from "../../contexts/SmartphonesContext";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Divider,
	Grid,
	Stack,
	Rating,
	Snackbar,
	Alert,
	useMediaQuery,
} from "@mui/material";

// The image on a posted smartphone card has these styling settings
const imageSettings = {
	width: "5.5em",
	height: "5.5em",
	borderRadius: "10%",
};

// This component displays a smartphone and its information on main pages
function PostedSmartphone({ phone, btn }) {
	var nf = new Intl.NumberFormat();
	const navigate = useNavigate();

	// Used to see if screen sizes are small
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("lg"));

	//Functions from global cart
	const { handleAddCart, handleRemoveCart } = useGlobalCart();
	const {
		setClickedSmartphone,
		handlePhoneAvailability,
	} = useGlobalSmartphones();
	const {
		img,
		phoneName,
		phoneDesc,
		seller,
		sellerLocation,
		amount,
		availability,
	} = phone;

	// Snackbar code
	const [successReq, setSuccessReq] = useState(false);
	const [removeReq, setRemoveReq] = useState(false);
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

	// When a card is clicked this function is called
	//If Buy Now button is clicked, Buy Now handler is invoked
	//If Remove button is clicked from inside cart then remove handler is called
	//else we navigate to display detailed information of a smartphone
	const handleMoreInfo = (e) => {
		if (btn !== "manage") {
			if (e.target.id === "buyNow") {
				handleBuyNow();
			} else if (e.target.id === "remove") {
				handleRemove();
			} else {
				setClickedSmartphone({ ...phone });
				navigate("/phoneInfo", 100);
			}
		} else if (btn === "manage") {
			setClickedSmartphone({ ...phone });
			navigate("/manage-smartphone", 100);
		}
	};

	const handleBuyNow = () => {
		setSuccessReq(true);
		handleAddCart(phone);
		handlePhoneAvailability(phone, "decrease");
		setSnackOpen(true);
	};
	const handleRemove = () => {
		setRemoveReq(true);
		handleRemoveCart(phone);
		handlePhoneAvailability(phone, "increase");
		setSnackOpen(true);
	};

	return (
		<Card
			sx={{
				marginTop: "2em",
				marginRight: "1em",
				marginBottom: "0.5em",
				"&:hover": {
					cursor: "pointer",
				},
			}}
			onClick={handleMoreInfo}
		>
			<Box>
				<CardContent>
					{/* Displaying information */}
					<Grid
						container
						direction={{
							xs: "column",
							md: "row",
						}}
						columnSpacing={{ xs: 1 }}
						justifyContent={matches ? "center" : "flex-start"}
						alignItems={matches && "center"}
					>
						<Grid item lg={1} sm={1}>
							<CardMedia
								component="img"
								sx={imageSettings}
								image={img}
								alt="Smartphone image"
							/>
						</Grid>
						<Grid item lg={4} sm={6}>
							<Typography
								component="div"
								variant="subtitle1"
								fontWeight={"bold"}
							>
								{phoneName}
							</Typography>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								component="div"
								sx={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "-webkit-box",
									WebkitLineClamp: "2",
									WebkitBoxOrient: "vertical",
									marginRight: "1rem",
								}}
							>
								{phoneDesc}
							</Typography>
						</Grid>

						<Grid item lg={1} sm={1}>
							<Divider orientation="vertical" />
						</Grid>
						<Grid
							item
							lg={2}
							sm={3}
							sx={{
								paddingLeft: "1%",
							}}
							mt={matches && 2}
						>
							<Typography
								component="div"
								variant="subtitle2"
								fontWeight={"700"}
							>
								{seller}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								component="div"
							>
								{sellerLocation}
							</Typography>
							<Rating
								name="seller-rating"
								defaultValue={2.5}
								precision={0.5}
								readOnly
								size="small"
								sx={{
									marginTop: "0.5em",
								}}
							/>
						</Grid>
						<Grid
							item
							lg={2}
							sm={1}
							sx={{
								paddingTop: "1.5%",
							}}
						>
							<Typography
								variant="subtitle1"
								color="text.primary"
								component="div"
								fontWeight={"bold"}
							>
								Rs. {nf.format(amount)}
							</Typography>

							{/* If this component is used in Cart then remove btn is sent and total items of 
							the smartphone added in cart are shown */}
							{btn === "remove" && (
								<Typography
									variant="subtitle2"
									color="text.primary"
									component="div"
									fontWeight={"bold"}
									sx={{
										marginTop: "0.5rem",
									}}
								>
									Smartphone Items: {phone.phoneItems}
								</Typography>
							)}

							{/* If smartphone is on main pages and buy button is used so its availability is displayed */}
							{btn === "buy" &&
								(availability > 0 ? (
									<Typography
										variant="subtitle2"
										color="text.primary"
										component="div"
										fontWeight={"bold"}
										sx={{
											marginTop: "0.5rem",
										}}
									>
										Availability: {availability}
									</Typography>
								) : (
									<Typography
										variant="subtitle2"
										color="text.primary"
										component="div"
										fontWeight={"bold"}
										sx={{
											marginTop: "0.5rem",
										}}
									>
										Out of Stock
									</Typography>
								))}
						</Grid>
						{/* Buttons on the Card of a smartphone , either a Buy Now button or a remove button */}
						<Grid item lg={2} xs={12}>
							{btn === "buy" && (
								<Stack
									direction={{
										xs: "row",
										lg: "column",
									}}
								>
									<button
										className="BuyNow BuyNowText"
										id="buyNow"
										disabled={availability === 0}
									>
										BUY NOW
									</button>
								</Stack>
							)}
							{btn === "remove" && (
								<Stack
									direction={{
										xs: "row",
										lg: "column",
									}}
								>
									<button className="Remove" id="remove">
										REMOVE
									</button>
								</Stack>
							)}
							{btn === "manage" && (
								<Stack
									direction={{
										xs: "row",
										lg: "column",
									}}
								>
									<button className="BuyNow BuyNowText" id="manage">
										Manage Phone
									</button>
								</Stack>
							)}
						</Grid>
					</Grid>
				</CardContent>
			</Box>

			{/* Snackbar is shown when an operation is performed */}
			{/* Buy Now snackar */}
			<Snackbar
				open={snackOpen && btn === "buy"}
				autoHideDuration={3000}
				onClose={handleSnackBarClick}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				{successReq === true ? (
					<SnackbarAlert onClose={handleSnackBarClick} severity="success">
						Phone added to Cart!
					</SnackbarAlert>
				) : (
					<SnackbarAlert onClose={handleSnackBarClick} severity="error">
						Unable to Add Phone to Cart!
					</SnackbarAlert>
				)}
			</Snackbar>
			{/* Remove from Cart Snackbar */}
			<Snackbar
				open={snackOpen && btn === "remove"}
				autoHideDuration={3000}
				onClose={handleSnackBarClick}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				{removeReq === true ? (
					<SnackbarAlert onClose={handleSnackBarClick} severity="success">
						Phone removed from Cart!
					</SnackbarAlert>
				) : (
					<SnackbarAlert onClose={handleSnackBarClick} severity="error">
						Unable to remove Phone from Cart!
					</SnackbarAlert>
				)}
			</Snackbar>
		</Card>
	);
}
export default PostedSmartphone;
