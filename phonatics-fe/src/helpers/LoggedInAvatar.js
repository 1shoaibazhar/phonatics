import React from "react";
import { useGlobalUser } from "../contexts/UserContext";
import { stringAvatar } from "./avatar";
import {
	Avatar,
	ListItem,
	ListItemText,
	ListItemButton,
	ListItemIcon,
} from "@mui/material";

//Styles of a list item text
const listItemText = {
	marginLeft: "-0.9rem",
	fontFamily: "Montserrat",
	letterSpacing: "1px",
	fontWeight: "600",
	color: " #90908f ",
	fontSize: "0.8em",
};

// To show avatar of a logged in user
function LoggedInAvatar() {
	// Using the global context state
	const { globalUser } = useGlobalUser();
	let Name = "";
	if (globalUser.name !== undefined) {
		if (globalUser.name.split(" ")[1] === undefined) {
			Name = `${globalUser.name.split(" ")[0]}`;
		} else {
			Name = `${globalUser.name.split(" ")[0]} ${
				globalUser.name.split(" ")[1]
			}`;
		}
	}

	return (
		<ListItem
			key={globalUser.userName}
			disablePadding
			sx={{ marginBottom: "0.8em" }}
		>
			<ListItemButton>
				<ListItemIcon sx={{ color: "dimgray" }}>
					<Avatar {...stringAvatar(globalUser.name)} variant="rounded" />
				</ListItemIcon>
				<ListItemText disableTypography sx={listItemText}>
					{Name}
				</ListItemText>
			</ListItemButton>
		</ListItem>
	);
}
export default LoggedInAvatar;
