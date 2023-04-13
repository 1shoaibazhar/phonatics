import React, { useContext, useState } from "react";

const SmartphonesContext = React.createContext();

export function useGlobalSmartphones() {
	return useContext(SmartphonesContext);
}

//Global context of Smartphones fetched
//Handles the smartphone items
function SmartphonesProvider({ children }) {
	const [globalSmartphones, setGlobalSmartphones] = useState([]);
	const [clickedSmartphone, setClickedSmartphone] = useState({});
	const handlePhoneAvailability = (phone, operation) => {
		let tmpSmartphones = globalSmartphones.map((phoneObj) => {
			if (phoneObj.phoneID === phone.phoneID) {
				phoneObj.availability =
					operation === "decrease"
						? phoneObj.availability - 1
						: phoneObj.availability + 1;
			}
			return phoneObj;
		});

		setGlobalSmartphones([...tmpSmartphones]);
	};

	const deletePhone = (phone) => {
		let tmpSmartphones = globalSmartphones.filter((phoneObj) => {
			return phoneObj.phoneID !== phone.phoneID;
		});
		setGlobalSmartphones([...tmpSmartphones]);
	};
	return (
		<SmartphonesContext.Provider
			value={{
				globalSmartphones,
				setGlobalSmartphones,
				clickedSmartphone,
				setClickedSmartphone,
				handlePhoneAvailability,
				deletePhone,
			}}
		>
			{children}
		</SmartphonesContext.Provider>
	);
}

export default SmartphonesProvider;
