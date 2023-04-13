import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const Responsive = styled("div")(({ theme }) => ({
	[theme.breakpoints.down("sm")]: {
		width: "100%",
	},
	[theme.breakpoints.up("md")]: {
		width: "60%",
	},
	[theme.breakpoints.up("lg")]: {
		width: "60%",
	},
}));

function SearchBar({
	searchQuery,
	setSearchQuery,
	handleSearchPhones,
	text,
	setShowLoading,
}) {
	const handleSearch = () => {
		setShowLoading(true);
		handleSearchPhones();
	};
	const handleEnterKey = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
			setShowLoading(true);
			handleSearchPhones();
		}
	};
	return (
		<Responsive>
			<div>
				<Paper
					component="form"
					sx={{
						p: "2px 4px",
						display: "flex",
						alignItems: "center",
					}}
					elevation={2}
				>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder={text}
						inputProps={{ "aria-label": `${text}` }}
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						onKeyDown={handleEnterKey}
					/>
					<IconButton
						type="button"
						sx={{ p: "10px" }}
						aria-label="search"
						onClick={handleSearch}
					>
						<SearchIcon />
					</IconButton>
				</Paper>
			</div>
		</Responsive>
	);
}
export default SearchBar;
