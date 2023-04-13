import React, { useState, useEffect } from "react";
import Sidebar from "./NavBars/Sidebar";
import { Stack, Paper } from "@mui/material";
import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../css/phonaticsName.css";
import "../css/styles.css";
import TopBar from "./NavBars/TopBar";
import DropDown from "../helpers/DropDown";
import OrderInformation from "./OrderInformation";
import OrderInfoDialog from "../helpers/OrderInfoDialog";
function ManageOrders() {
	const [open, setOpen] = useState(false);
	const [searchBy, setSearchBy] = useState("Pending");
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState({});
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));
	const ordersData = [
		{
			orderID: 123456,
			orderingDate: Date(),
			shippingDate: Date(),
			shippingAddress: "House 11, Street 11, G-11/1, Islamabad",
			buyerName: "Anna Ahmed",
			orderStatus: "Pending",
			totalAmount: 543476,
			orderItems: {
				obj125623: "iPhone 14",
				obj751422: "Samsung Galaxy S22",
				obj11bhg12: "iphone 11 pro",
			},
			sellerIDs: {
				"124532": ["obj125623", "obj11bhg12"],
				"455321": ["obj751422"],
			},
		},
		{
			orderID: 984310,
			orderingDate: Date(),
			shippingDate: Date(),
			shippingAddress: "House 12, Street 11, H-11/1, Islamabad",
			buyerName: "Maria Hassan",
			orderStatus: "Pending",
			totalAmount: 613476,
			orderItems: {
				obj125623: "iPhone 14",
				obj751422: "Samsung Galaxy",
			},
			sellerIDs: {
				"124532": ["obj125623"],
				"455321": ["obj751422"],
			},
		},
		{
			orderID: 387219,
			orderingDate: Date(),
			shippingDate: Date(),
			shippingAddress: "House 12, Street 11, H-11/1, Islamabad",
			buyerName: "Shoaib Azhar",
			orderStatus: "Confirmed",
			totalAmount: 213476,
			orderItems: {
				obj125623: "iPhone 14",
				obj751422: "Samsung Galaxy S22",
			},
			sellerIDs: {
				"124532": ["obj125623"],
				"455321": ["obj751422"],
			},
		},
		{
			orderID: 741190,
			orderingDate: Date(),
			shippingDate: Date(),
			shippingAddress: "House 12, Street 11, H-11/1, Islamabad",
			buyerName: "Osama Imran",
			orderStatus: "Delivered",
			totalAmount: 213476,
			orderItems: {
				obj125623: "iPhone 14",
			},
			sellerIDs: {
				"124532": ["obj125623"],
			},
		},
	];
	const [orders, setOrders] = useState(ordersData);
	useEffect(() => {
		//Backend API call here to get those orders which the user is searching e.g. Pending, Confirmed or Delivered
		let tmpOrders = ordersData.filter((order) => {
			return order.orderStatus === searchBy;
		});

		setOrders((orders) => [...tmpOrders]);
	}, [searchBy]);

	return (
		<Box ml={0}>
			<Grid container>
				<Grid item xs={2}>
					<Sidebar
						open={open}
						handleDrawerClose={handleDrawerClose}
						matches={matches}
					/>
				</Grid>
				<Grid item xs={10} ml={matches ? "8%" : "15%"} align={"center"}>
					<TopBar
						matches={matches}
						open={open}
						handleDrawerOpen={handleDrawerOpen}
					/>
					<Box mt={0} mr={2} ml={2} width={"100%"}>
						<Paper
							sx={{
								paddingRight: "5%",
								paddingLeft: "5%",
								minHeight: "100vh",
								paddingTop: "1rem",
								paddingBottom: "2rem",
							}}
							elevation={0}
						>
							<Stack direction="row" spacing={5}>
								<h6 className="orderInformation">Order Information </h6>
								<DropDown
									options={["Pending", "Confirmed", "Delivered"]}
									names={[
										"Pending Orders",
										"Confirmed Orders",
										"Delivered Orders",
									]}
									setSearchBy={setSearchBy}
								/>
							</Stack>
							<Grid container columnSpacing={1}>
								{orders.map((order, index) => (
									<Grid item lg={4} md={6} xs={12} key={index}>
										<OrderInformation
											order={order}
											key={index}
											setShowEditDialog={setShowEditDialog}
											setSelectedOrder={setSelectedOrder}
											selectedOrder={selectedOrder}
										/>
									</Grid>
								))}
							</Grid>
							{showEditDialog === true && (
								<OrderInfoDialog
									order={selectedOrder}
									setShowEditDialog={setShowEditDialog}
									showEditDialog={showEditDialog}
									key={selectedOrder.orderID}
								/>
							)}
						</Paper>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
export default ManageOrders;
