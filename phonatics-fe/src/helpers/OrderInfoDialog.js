import React, { useState } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	Radio,
	RadioGroup,
	FormControl,
	FormControlLabel,
} from "@mui/material";

//Date and Date Pickers
import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

//Component to show an order's information
function OrderInfoDialog({ order, showEditDialog, setShowEditDialog }) {
	//state to store edited order
	const [editedOrder, setEditedOrder] = useState(order);
	var nf = new Intl.NumberFormat();

	//Shipping Date Change
	const handleShippingDateChange = (newValue) => {
		setEditedOrder((editedOrder) => ({
			...editedOrder,
			shippingDate: newValue,
		}));
	};

	//Order Status Change
	const handleOrderStatusChange = (e) => {
		setEditedOrder((editedOrder) => ({
			...editedOrder,
			orderStatus: e.target.value,
		}));
	};

	const handleClose = () => {
		setShowEditDialog(false);
	};

	const handleUpdate = () => {
		// API here for updating in database
		console.log(editedOrder);
		setShowEditDialog(false);
	};
	return (
		<div>
			<Dialog
				open={showEditDialog}
				onClose={handleClose}
				sx={{ padding: "1rem" }}
			>
				<DialogTitle
					sx={{
						marginTop: "0.5rem",
						marginBottom: "0.5rem",
						fontWeight: "bold",
					}}
				>
					Order Information of {editedOrder.orderID}
				</DialogTitle>
				<DialogContent>
					<form onSubmit={handleUpdate}>
						<Typography variant="body1">
							Buyer Name: {editedOrder.buyerName}
						</Typography>
						<Typography
							variant="body1"
							sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
						>
							Order Date: {dayjs(editedOrder.orderingDate).format("MM/DD/YYYY")}
						</Typography>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDatePicker
								label="Shipping Date"
								inputFormat="MM/DD/YYYY"
								value={editedOrder.shippingDate}
								onChange={handleShippingDateChange}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
						<Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
							Shipping Address: {editedOrder.shippingAddress}
						</Typography>
						<Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
							Total Amount: Rs. {nf.format(editedOrder.totalAmount)}
						</Typography>
						<Typography
							variant="body1"
							sx={{ fontWeight: "bold", marginTop: "0.5rem" }}
						>
							Ordered Items
						</Typography>

						{Object.entries(editedOrder.orderItems).map(([key, value]) => (
							<Typography variant="subtitle1" sx={{ marginTop: "0.3rem" }}>
								{value}
							</Typography>
						))}

						<Typography
							variant="subtitle1"
							sx={{ fontWeight: "bold", marginTop: "0.5rem" }}
						>
							Order Status
						</Typography>
						{/* Order Status options are Pending, Confirmed and Delivered */}
						<FormControl>
							<RadioGroup
								row
								aria-labelledby="order-status-radio-group"
								name="orderStatus"
								value={editedOrder.orderStatus}
								onChange={handleOrderStatusChange}
								defaultValue={editedOrder.orderStatus}
							>
								<FormControlLabel
									value="Pending"
									control={<Radio />}
									label="Pending"
								/>
								<FormControlLabel
									value="Confirmed"
									control={<Radio />}
									label="Confirmed"
								/>
								<FormControlLabel
									value="Delivered"
									control={<Radio />}
									label="Delivered"
								/>
							</RadioGroup>
						</FormControl>
						<DialogActions>
							<Button
								onClick={handleClose}
								variant="outlined"
								color="error"
								sx={{ margin: "0 1rem" }}
								type="button"
							>
								Cancel
							</Button>
							<Button type="submit" variant="contained" color="primary">
								Update
							</Button>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
export default OrderInfoDialog;
