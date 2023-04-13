import { useState } from "react";
// A hook to have values, set values and reset values in forms
function useFormInputState(initialFormValue) {
	const [values, setValues] = useState(initialFormValue);
	const handleFormChange = (evt) => {
		const { name, value } = evt.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const reset = (initialFormValue) => {
		setValues(initialFormValue);
	};

	return [values, handleFormChange, reset];
}

export default useFormInputState;
