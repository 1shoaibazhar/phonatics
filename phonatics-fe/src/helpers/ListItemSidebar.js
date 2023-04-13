import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const listItemText = {
	marginLeft: "-1.4rem",
	fontFamily: "Montserrat",
	letterSpacing: "1px",
	fontWeight: "600",
	color: " #90908f ",
	fontSize: "0.8em",
};

function ListItemSidebar({ val, text, icon, amount, handleClick }) {
	return (
		<ListItem
			key={val}
			disablePadding
			sx={{ marginBottom: "0.8em" }}
			onClick={handleClick}
		>
			<ListItemButton>
				<ListItemIcon sx={{ color: "dimgray" }}>{icon}</ListItemIcon>
				<ListItemText disableTypography sx={listItemText}>
					{text}
					{text === "Cart" && (
						<span style={{ marginLeft: "3em" }}>Rs. {amount}</span>
					)}
				</ListItemText>
			</ListItemButton>
		</ListItem>
	);
}
export default ListItemSidebar;
