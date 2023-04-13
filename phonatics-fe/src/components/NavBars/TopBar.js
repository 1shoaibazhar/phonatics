import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/phonaticsName.css";
import { Stack, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// TopBar component is used when screen size is small so the sidebar is closed and we can use this topbar to open it
function TopBar({ matches, open, handleDrawerOpen }) {
	const navigate = useNavigate();
	const [nameHover, setNameHover] = useState(false);
	const handleNameClick = () => {
		setTimeout(() => {
			navigate("/homePage");
		}, 500);
	};
	return (
		<div>
			{/* matches is true when screen size is less than medium */}
			{matches && (
				<>
					<Stack direction="row" justifyContent={"center"}>
						{
							<h1
								className="heading"
								onClick={handleNameClick}
								onMouseOver={() => {
									setNameHover(true);
								}}
								style={
									nameHover ? { cursor: "pointer" } : { cursor: "default" }
								}
							>
								Phonatics
							</h1>
						}

						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							sx={{ ml: 1, mt: 1, ...(open && { display: "none" }) }}
							onClick={handleDrawerOpen}
						>
							<MenuIcon />
						</IconButton>
					</Stack>
				</>
			)}
		</div>
	);
}
export default TopBar;
