import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { useGlobalCart } from "../contexts/CartItems";
import { useGlobalUser } from "../contexts/UserContext";
import useFormInputState from "../hooks/useFormInputState";
import axios from "axios";
function PlaceOrder({
	showPlaceOrderDialog,
	setShowPlaceOrderDialog,
	setSnackOpen,
	setSuccessReq,
	handleEmptyCart,
}) {
	const { CartAmount, globalCart } = useGlobalCart();
	const { globalUser } = useGlobalUser();
	const order = {
		orderingDate: dayjs(Date()).format("MM/DD/YYYY"),
		shippingDate: dayjs(Date())
			.add(3, "day")
			.format("MM/DD/YYYY"),
		shippingAddress: "",
		buyerUserName: globalUser.userName,
		orderStatus: "Pending",
		totalAmount: CartAmount() + 500, //500 is delivery fees
		orderItems: {},
		buyerPhoneNumber: "",
	};
	let tmpItems = {};
	globalCart.forEach(function(item, index) {
		tmpItems[item.phoneID] = [item.phoneName, item.sellerId, item.phoneItems];
	});
	order.orderItems = {
		...tmpItems,
	};
	const [values, handleFormChange, reset] = useFormInputState(order);

	const handleClose = () => {
		setShowPlaceOrderDialog(false);
	};

	const handlePostOrderRequest = async (Data) => {
		try {
			const postReq = axios.post(
				"http://localhost:8080/smartphone/placeOrder",
				Data
			);
			await postReq;
		} catch (err) {
			console.log(err);
			console.log("Error while sending post request to server");
		}
	};

	const handlePlaceOrder = () => {
		handlePostOrderRequest(values);
		reset(order);
		setShowPlaceOrderDialog(false);
		setSuccessReq(true);
		setSnackOpen(true);
		handleEmptyCart();
	};

	const [disableSubmit, setDisableSubmit] = useState(true);
	useEffect(() => {
		if (values.shippingAddress === "" || values.buyerPhoneNumber === "") {
			setDisableSubmit(true);
			return;
		}
		setDisableSubmit(false);
	}, [values]);

	return (
		<div>
			<Dialog
				open={showPlaceOrderDialog}
				onClose={handleClose}
				sx={{
					padding: "1rem",
				}}
			>
				<DialogTitle
					sx={{
						marginTop: "0.5rem",
						fontWeight: "bold",
					}}
				>
					Order Details
				</DialogTitle>
				<DialogContent>
					<Typography
						variant="body1"
						sx={{
							margin: "0.5rem 0",
						}}
					>
						Buyer UserName: {values.buyerUserName}
					</Typography>
					<Typography
						variant="body1"
						sx={{
							margin: "0.5rem 0",
						}}
					>
						Order Date: {values.orderingDate}
					</Typography>
					<Typography
						variant="body1"
						sx={{
							margin: "0.5rem 0",
						}}
					>
						Shipping Date: {values.shippingDate}
					</Typography>
					<Typography
						variant="body1"
						sx={{
							margin: "0.5rem 0",
							fontWeight: "600",
						}}
					>
						Cash on Delivery
					</Typography>
					<form onSubmit={handlePlaceOrder}>
						<TextField
							name="shippingAddress"
							variant="outlined"
							label="Shipping Address"
							placeholder="Provide the shipping address"
							value={values.shippingAddress}
							fullWidth
							onChange={handleFormChange}
							sx={{
								backgroundColor: "white",
								margin: "1rem 0",
							}}
						/>
						<TextField
							name="buyerPhoneNumber"
							variant="outlined"
							label="Phone Number"
							placeholder="Provide the phone number for contact"
							value={values.buyerPhoneNumber}
							fullWidth
							onChange={handleFormChange}
							sx={{
								backgroundColor: "white",
								margin: "1rem 0",
							}}
							type="number"
						/>
						<DialogActions>
							<Button
								onClick={handleClose}
								variant="outlined"
								color="error"
								sx={{
									margin: "0 1rem",
								}}
								type="button"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={disableSubmit}
							>
								Place Order
							</Button>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
export default PlaceOrder;
