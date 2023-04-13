import React from "react";
import { styled } from "@mui/material/styles";
import {
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
} from "@mui/material";

// Styling Material-UI table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "black",
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

// Styling Material-UI table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

// PhoneSpecs component takes phone features and displays them in a table
// This component is used in SmartphoneInfo component
function PhoneSpecs({ features }) {
	return (
		<TableContainer
			component={Paper}
			sx={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
		>
			<Table aria-label="customized table">
				<TableHead>
					<TableRow>
						<StyledTableCell align="center" colSpan={2}>
							<Typography>Smartphone Specifications</Typography>
						</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* Mapping each feature i.e. a key and its value i.e. [Battery,4000mah] and making a table row and table cell */}
					{Object.entries(features).map(([key, value]) => (
						<StyledTableRow key={key}>
							<StyledTableCell component="th" scope="row">
								{/* Making the first letter as upper case and space between the first and second letter */}
								{/* For Example selfieCamera becomes Selfie Camera */}
								{key[0].toUpperCase() +
									key.substring(1).replace(/([A-Z])/g, " $1")}
							</StyledTableCell>
							<StyledTableCell align="right">{value}</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
export default PhoneSpecs;
