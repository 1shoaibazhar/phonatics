import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, {
	linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Typography } from "@mui/material";
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
	},
}));

export default function LinearProgressBar({ progress, progressText }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				marginBottom: "2rem",
				marginTop: "1rem",
			}}
		>
			<Box sx={{ width: "100%", mr: 1 }}>
				<BorderLinearProgress variant="determinate" value={progress} />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="body2" color="text.secondary">{`${Math.round(
					progress
				)}%`}</Typography>
			</Box>
		</Box>
	);
}
