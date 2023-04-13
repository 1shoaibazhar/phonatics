import React from "react";
import { Box, InputLabel, FormControl, NativeSelect } from "@mui/material";

// Helper component to show a dropdown to seller about what type of orders they want to view
function DropDown({ options, names, setSearchBy }) {
	const handleChange = (event) => {
		setSearchBy(event.target.value);
	};
	return (
		<Box
			sx={{
				minWidth: 120,
			}}
		>
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					Search By
				</InputLabel>
				<NativeSelect
					defaultValue={options[0]}
					inputProps={{
						name: "search",
						id: "uncontrolled-native",
					}}
					onChange={handleChange}
				>
					{options.map((val, index) => (
						<option value={val} key={val}>
							{names[index]}
						</option>
					))}
				</NativeSelect>
			</FormControl>
		</Box>
	);
}
export default DropDown;
