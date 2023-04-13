import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { StarBorder } from "@mui/icons-material";

const StyledRating = styled(Rating)({
	"& .MuiRating-iconFilled": {
		color: "#6495ED",
	},
});

export default function RatingStars({ value }) {
	return (
		<Box
			sx={{
				"& > legend": { mt: 2 },
			}}
		>
			<StyledRating
				name="customized-stars"
				precision={0.1}
				value={value}
				max={10}
				icon={<StarIcon fontSize="inherit" />}
				emptyIcon={<StarBorder fontSize="inherit" />}
				readOnly
			/>
		</Box>
	);
}
