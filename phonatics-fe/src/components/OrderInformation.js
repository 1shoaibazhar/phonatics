import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function OrderInformation({ order, setShowEditDialog, setSelectedOrder }) {
	const [showOptions, setShowOptions] = useState(false);
	var nf = new Intl.NumberFormat();
	const handleEdit = () => {
		setSelectedOrder((selectedOrder) => ({ ...order }));
		setShowEditDialog(true);
	};
	return (
		<Card
			sx={{
				width: 300,
				marginTop: "0.5rem",
				marginBottom: "0.5rem",
				borderRadius: "2%",
				marginLeft: "0.2rem",
				marginRight: "0.2rem",
				backgroundColor: "#f2f2f2",
			}}
			onMouseOver={() => {
				setShowOptions(true);
			}}
			onMouseOut={() => {
				setShowOptions(false);
			}}
		>
			<CardContent>
				<Typography variant="body2" sx={{ fontWeight: "bold" }}>
					Buyer Name: {order.buyerName}
				</Typography>
				<Typography variant="body2" sx={{ fontWeight: "bold" }}>
					Order ID: {order.orderID}
				</Typography>
				<Typography variant="subtitle1">
					Shipping Address: {order.shippingAddress}
					<br />
				</Typography>
				<hr></hr>
				<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
					Ordered Items
				</Typography>

				{Object.entries(order.orderItems).map(([key, value]) => (
					<Typography variant="subtitle2" key={key}>
						{value}
					</Typography>
				))}
				<Typography variant="subtitle2" sx={{ marginTop: "0.3rem" }}>
					<b>Total Amount:</b> Rs. {nf.format(order.totalAmount)}
				</Typography>
			</CardContent>
			<CardActions>
				<Chip
					label={order.orderStatus}
					variant="outlined"
					size="small"
					style={{
						backgroundColor: `${
							order.orderStatus === "Pending" ? "#c2f0c2" : "#99e6ff"
						}`,
					}}
					sx={{ marginLeft: "0.5rem", color: "black" }}
				/>
				{showOptions && (
					<>
						<IconButton
							sx={{ padding: "0", marginLeft: "auto" }}
							onClick={handleEdit}
						>
							<EditIcon />
						</IconButton>
					</>
				)}
			</CardActions>
		</Card>
	);
}
export default OrderInformation;
