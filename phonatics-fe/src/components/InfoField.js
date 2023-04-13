import React, { useEffect } from "react";
import useToggleState from "../hooks/useToggleState";
import EditField from "../helpers/EditField";
import {
	ListItem,
	ListItemText,
	Paper,
	ListItemSecondaryAction,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

//Component for one field of information
function InfoField(props) {
	const [isEditing, toggle] = useToggleState(false);

	useEffect(() => {
		if (props.setEditOpen !== undefined) {
			props.setEditOpen(isEditing);
		}
	}, [isEditing]);

	return (
		<Paper sx={{ marginLeft: "5%" }}>
			<ListItem style={{ height: "60px", margin: "1.5rem 0" }}>
				{/* If we toggle the edit input field then an edit field component is rendered */}
				{isEditing ? (
					<EditField
						editField={props.editField}
						field={props.field}
						value={props.value}
						toggleEditForm={toggle}
					/>
				) : (
					<>
						{/* Else we view information and a edit pen icon to toggle the form */}
						<ListItemText>
							<span style={{ fontWeight: "bold" }}>{props.label} :</span>{" "}
							{props.value}
						</ListItemText>
						<ListItemSecondaryAction>
							<IconButton
								aria-label="Edit"
								onClick={toggle}
								disabled={props.field === "userName" ? true : false}
							>
								<EditIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</>
				)}
			</ListItem>
		</Paper>
	);
}
export default InfoField;
