import React from "react";
import {
	Box,
	styled,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableContainer,
	Paper,
	TableRow,
	Stack,
} from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import RatingStars from "../../helpers/RatingStars";
import YouTubeLogo from "../../images/YouTube.jpg";

const StyledTableCell = styled(TableCell)({
	minWidth: 200,
	fontWeight: "500",
});

function capitalizeWords(str) {
	// split the string into an array of words
	let words = str.split(" ");

	// map over the array and capitalize the first letter of each word
	words = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});

	// join the words back into a single string
	return words.join(" ");
}

function AnalysisReport({ features, videoName, channelName, videoLink }) {
	const data = Object.entries(features).map(([feature, rating]) => ({
		feature: capitalizeWords(feature),
		rating,
	}));
	return (
		<Box mt={2} mb={5}>
			<Stack direction={"row"} spacing={2}>
				<Typography
					variant="h5"
					fontWeight="700"
					marginLeft={"4rem"}
					marginTop={"2.3rem"}
				>
					Aspect-Based Analysis Report
				</Typography>
				<img src={YouTubeLogo} alt="YouTube" width={100} height={100} />
			</Stack>

			<Typography variant="body1" marginTop={"1rem"}>
				YouTube Video: {videoName}
			</Typography>
			<Typography variant="body1" marginTop={"1rem"}>
				Youtube Channel: {channelName}
			</Typography>
			<Typography variant="body1" marginTop={"1rem"} marginBottom={"1rem"}>
				<a href={videoLink} target="_blank">
					{videoLink}
				</a>
			</Typography>
			<TableContainer
				component={Paper}
				sx={{
					width: "100%",
					marginLeft: "auto",
					marginRight: "auto",
					marginBottom: "70px",
				}}
			>
				<Table>
					<TableHead>
						<TableRow>
							<StyledTableCell>
								<Typography variant="h6" fontWeight={600}>
									Feature
								</Typography>
							</StyledTableCell>
							<StyledTableCell>
								<Typography variant="h6" fontWeight={600}>
									Rating
								</Typography>
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.entries(features).map(([key, value]) => (
							<TableRow key={key}>
								<StyledTableCell>{capitalizeWords(key)}</StyledTableCell>
								<TableCell>
									<Stack direction="row" spacing={1}>
										<Typography variant="body1" component="span">
											{(value = value % 1 === 0 ? value.toFixed(1) : value)}
										</Typography>
										<RatingStars value={value} />
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<ResponsiveContainer width="200%" height={400}>
				<BarChart
					width={800}
					height={400}
					data={data}
					margin={{ top: 5, bottom: 50, left: -35, right: 50 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="feature"
						angle={-45}
						textAnchor="end"
						interval={0}
						height={80}
					/>
					<YAxis tickCount={6} />
					<Tooltip />
					<Bar dataKey="rating" fill="#6495ED" />
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
}
export default AnalysisReport;
