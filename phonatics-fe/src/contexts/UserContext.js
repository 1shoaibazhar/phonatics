import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";

const UserContext = React.createContext();

export function useGlobalUser() {
	return useContext(UserContext);
}
// Global context of the User i.e. the logged in user , either a buyer or a seller
function UserProvider({ children }) {
	const [globalUser, setGlobalUser] = useState({});

	useEffect(() => {
		let globalUserCookie = Cookies.get("globalUserCookie");
		if (
			globalUserCookie !== "undefined" &&
			globalUserCookie !== null &&
			globalUserCookie !== undefined
		) {
			setGlobalUser(JSON.parse(globalUserCookie));
		}
	}, []);

	return (
		<UserContext.Provider
			value={{
				globalUser,
				setGlobalUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export default UserProvider;
