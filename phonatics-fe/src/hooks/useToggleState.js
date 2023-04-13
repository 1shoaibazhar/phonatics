import { useState } from "react";
// A hook to toggle a state
function useToggle(initialVal = false) {
	const [state, setState] = useState(initialVal);
	const toggle = () => {
		setState(!state);
	};
	return [state, toggle];
}
export default useToggle;
