import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "../../css/phonaticsName.css";
import { useGlobalUser } from "../../contexts/UserContext";
import { useGlobalCart } from "../../contexts/CartItems";
import { useNavigate } from "react-router-dom";
import ListItemSidebar from "../../helpers/ListItemSidebar";
import LoggedInAvatar from "../../helpers/LoggedInAvatar";
import {
	Box,
	Drawer,
	List,
	Divider,
	IconButton,
	Stack,
	Tooltip,
} from "@mui/material";

//Icons to use in sidebar options
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";
import LogoutIcon from "@mui/icons-material/Logout";
import SupportIcon from "@mui/icons-material/Support";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

//Sidebar component is used to show the application options like Profile, Marketplace etc and handles their clicks
function Sidebar({ open, handleDrawerClose, matches }) {
	// Using the global context state
	const { globalUser, setGlobalUser } = useGlobalUser();
	// Using the cart amount function of global cart
	const { CartAmount } = useGlobalCart();

	//state to see if "Phonatics" name is hovered
	const [nameHover, setNameHover] = useState(false);

	// Object of current user containing password
	let userObj = globalUser;

	const navigate = useNavigate();

	const handleProfileClick = () => {
		setTimeout(() => {
			navigate("/credential-page");
		}, 500);
	};

	const handleEditProfileClick = () => {
		setTimeout(() => {
			navigate("/editProfile-page");
		}, 500);
	};

	const handleHomePageClick = () => {
		setTimeout(() => {
			navigate("/");
		}, 500);
	};

	const handleCartClick = () => {
		setTimeout(() => {
			navigate("/cart");
		}, 500);
	};

	const handleSignOutClick = () => {
		Cookies.remove("globalUserCookie", { sameSite: "Lax", secure: true });
		setGlobalUser({});
		navigate("/");
	};

	const handleMySmartphones = () => {
		setTimeout(() => {
			navigate("/my-smartphones");
		}, 500);
	};

	const handleManageOrders = () => {
		setTimeout(() => {
			navigate("/manage-orders");
		}, 500);
	};

	useEffect(() => {}, [globalUser]);

	//To display total amount of the order
	let totalAmount = CartAmount();
	return (
		<Box
			sx={{
				display: "flex",
			}}
		>
			{/* Material UI drawer */}
			<Drawer
				sx={{
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						border: 0,
					},
				}}
				variant={matches ? "persistent" : "permanent"}
				anchor="left"
				open={open}
				width={matches ? "240px" : "17%"}
			>
				<Stack direction="row">
					<h1
						className="heading"
						onClick={handleHomePageClick}
						onMouseOver={() => {
							setNameHover(true);
						}}
						style={nameHover ? { cursor: "pointer" } : { cursor: "default" }}
					>
						Phonatics
					</h1>
					{/* Closed drawer on small screens has this button */}
					{matches && (
						<IconButton
							onClick={handleDrawerClose}
							sx={{
								mt: 1,
							}}
						>
							<ChevronLeftIcon />
						</IconButton>
					)}
				</Stack>

				<List
					sx={{
						marginLeft: "0.8em",
					}}
				>
					{/* List Item Sidebar is a component to create a list item with styling and passing 
					it name,icon and onCLick function */}
					<ListItemSidebar
						val={"marketplace"}
						text={"Marketplace"}
						icon={<ShoppingBagIcon />}
						handleClick={handleHomePageClick}
					/>

					{/* These two options are only for sellers */}
					{globalUser.type === "seller" && (
						<>
							<ListItemSidebar
								val={"manageOrders"}
								text={"Manage Orders"}
								icon={<LocalOfferIcon />}
								handleClick={handleManageOrders}
							/>
							<ListItemSidebar
								val={"myPhones"}
								text={"My Smartphones"}
								icon={<PhoneIphoneIcon />}
								handleClick={handleMySmartphones}
							/>{" "}
						</>
					)}

					{/* Buyer has this option only */}
					{globalUser.type === "buyer" && (
						<>
							<ListItemSidebar
								val={"trackOrder"}
								text={"Track Order"}
								icon={<LocationSearchingSharpIcon />}
							/>
						</>
					)}
					<ListItemSidebar
						val={"help"}
						text={"Help Centre"}
						icon={<SupportIcon />}
					/>
				</List>

				<Divider
					sx={{
						marginTop: "auto",
					}}
				/>

				{/* SignOut option available when user is logged in */}
				{Object.keys(globalUser).length !== 0 && (
					<div>
						<List
							sx={{
								marginLeft: "0.8em",
							}}
						>
							<div onClick={handleSignOutClick}>
								<ListItemSidebar
									val={"signOut"}
									text={"Sign Out"}
									icon={<LogoutIcon />}
								/>
							</div>
						</List>
					</div>
				)}
				<Divider />

				{/* To go to cart and see total amount on sidebar */}
				{Object.keys(globalUser).length !== 0 ? (
					<List
						sx={{
							marginLeft: "0.8em",
						}}
					>
						<div onClick={handleCartClick}>
							<ListItemSidebar
								val={"cart"}
								text={"Cart"}
								icon={<ShoppingCartIcon />}
								amount={totalAmount}
							/>
						</div>
					</List>
				) : (
					<Tooltip
						title="Create an account to place order"
						placement="left"
						arrow
						enterDelay={400}
						leaveDelay={200}
					>
						<List
							sx={{
								marginLeft: "0.8em",
							}}
						>
							<div>
								<ListItemSidebar
									val={"cart"}
									text={"Cart"}
									icon={<ShoppingCartIcon />}
									amount={totalAmount}
								/>
							</div>
						</List>
					</Tooltip>
				)}

				<Divider />

				{/* If user is not logged in, Profile option moves it to Credential Page */}
				{/* If user is logged in then manage profile page is opened */}
				<List
					sx={{
						marginLeft: "0.8em",
					}}
				>
					{Object.keys(userObj).length === 0 ? (
						<div onClick={handleProfileClick}>
							<ListItemSidebar
								val={"profile"}
								text={"Profile"}
								icon={<AccountCircleIcon />}
							/>
						</div>
					) : (
						<div onClick={handleEditProfileClick}>
							<LoggedInAvatar />
						</div>
					)}
				</List>
			</Drawer>
		</Box>
	);
}

export default Sidebar;
