import React from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

//This component is of the confirmation dialog of whether the seller is sure about deleting the smartphone or not
function DeleteSmartphoneDialog({
	showDeleteDialog,
	setShowDeleteDialog,
	handleDeleteSmartphone,
}) {
	//Calls the passed function to delete the smartphone
	const handleDelete = () => {
		handleDeleteSmartphone();
		setShowDeleteDialog(false);
	};
	const handleClose = () => {
		setShowDeleteDialog(false);
	};

	return (
		<div>
			<Dialog
				open={showDeleteDialog}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{
						"Are you sure you want to Delete this Smartphone from the application?"
					}
				</DialogTitle>
				<DialogActions>
					<Button onClick={handleDelete} autoFocus>
						Yes
					</Button>
					<Button onClick={handleClose}>No</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
export default DeleteSmartphoneDialog;
