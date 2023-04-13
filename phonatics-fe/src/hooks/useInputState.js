import { useState } from "react";
// A hook to have a state on a value and handle change on it and reset it
export default function useInputState(intiialVal) {
	const [value, setValue] = useState(intiialVal);
	const handleChange = (e) => {
		setValue(e.target.value);
	};
	const reset = () => {
		setValue("");
	};
	return [value, handleChange, reset];
}
