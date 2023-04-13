import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserCredentialPage from "./components/UserManagement/UserCredentialPage";
import Homepage from "./components/Homepage";
import SmartphoneInfo from "./components/Smartphone/SmartphoneInfo";
import UserInfo from "./components/UserManagement/UserInfo";
// import PrivateRoute from "./utils/PrivateRoutes";
import { Navigate } from "react-router-dom";
import UserProvider from "./contexts/UserContext";
import CartProvider from "./contexts/CartItems";
import SmartphonesProvider from "./contexts/SmartphonesContext";
import PostSmartphone from "./components/Smartphone/PostSmartphone";
import ManageSmartphone from "./components/Smartphone/ManageSmartphone";
import ManageOrders from "./components/ManageOrders";
import Cart from "./components/Cart";
import MySmartphones from "./components/Smartphone/MySmartphones";
// import Cookies from "js-cookie";
// import axios from "axios";
// axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;
import AnalysisReport from "./components/Smartphone/AnalysisReport";
import SpecificPhoneAnalysis from "./components/Smartphone/SpecificPhoneAnalysis";
function App() {
	return (
		<UserProvider>
			<CartProvider>
				<SmartphonesProvider>
					<BrowserRouter>
						<Routes>
							<Route exact path="/" element={<Homepage />} />
							<Route path="*" element={<Navigate to="/" />} />
							<Route
								exact
								path="/credential-page"
								element={<UserCredentialPage />}
							/>
							<Route exact path="/editProfile-page" element={<UserInfo />} />
							<Route exact path="/phoneInfo" element={<SmartphoneInfo />} />
							<Route
								exact
								path="/post-smartphone"
								element={<PostSmartphone />}
							/>
							<Route
								exact
								path="/manage-smartphone"
								element={<ManageSmartphone />}
							/>
							<Route exact path="/manage-orders" element={<ManageOrders />} />
							<Route exact path="/cart" element={<Cart />} />
							<Route exact path="/my-smartphones" element={<MySmartphones />} />
							<Route exact path="/analysis" element={<AnalysisReport />} />
							<Route
								exact
								path="/specific-phoneAnalysis"
								element={<SpecificPhoneAnalysis />}
							/>
						</Routes>
					</BrowserRouter>
				</SmartphonesProvider>
			</CartProvider>
		</UserProvider>
	);
}

export default App;
