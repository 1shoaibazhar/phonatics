// Function to display an avatar of the user name using the first letters of name and surname and giving it a color

function stringToColor(string) {
	if (string === undefined) {
		return;
	}
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

function stringAvatar(name) {
	let children1;
	if (name !== undefined) {
		if (name.split(" ")[1] === undefined) {
			children1 = `${name.split(" ")[0][0]}`;
		} else {
			children1 = `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;
		}
	}
	return {
		sx: {
			bgcolor: stringToColor(name),
			height: "2.1rem",
			width: "2.1rem",
		},
		children: children1,
	};
}

export { stringToColor, stringAvatar };
