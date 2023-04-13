import React, { useContext, useState } from "react";

const CartContext = React.createContext();

export function useGlobalCart() {
	return useContext(CartContext);
}
//Global context of Cart of the application
//Handles the smartphone items in it
function CartProvider({ children }) {
	const [globalCart, setGlobalCart] = useState([]);
	const handleAddCart = (phone) => {
		//If cart has that phone, increase item count of that same object
		//Else enter a new phone object with count=1
		let tmpObject;
		let val = globalCart.findIndex((item) => item.phoneID === phone.phoneID);
		if (val !== -1) {
			tmpObject = { ...phone, phoneItems: globalCart[val].phoneItems + 1 };
			setGlobalCart((globalCart) =>
				globalCart.filter((item) => {
					return item.phoneID !== tmpObject.phoneID;
				})
			);
			setGlobalCart((globalCart) => [...globalCart, tmpObject]);
		} else {
			tmpObject = { ...phone, phoneItems: 1 };
			setGlobalCart((globalCart) => [...globalCart, tmpObject]);
		}
	};

	//Function to remove a smartphone from cart
	const handleRemoveCart = (phone) => {
		let tmpObject;
		let val = globalCart.findIndex((item) => item.phoneID === phone.phoneID);
		//If multiple items of same phone then reduce its count by 1
		//Else remove the phone from cart if only 1 item of that smartphone was added in cart
		if (globalCart[val].phoneItems > 1) {
			tmpObject = { ...phone, phoneItems: globalCart[val].phoneItems - 1 };
			setGlobalCart((globalCart) =>
				globalCart.filter((item) => {
					return item.phoneID !== globalCart[val].phoneID;
				})
			);
			setGlobalCart((globalCart) => [...globalCart, tmpObject]);
		} else if (globalCart[val].phoneItems === 1) {
			setGlobalCart((globalCart) =>
				globalCart.filter((item) => {
					return item.phoneID !== globalCart[val].phoneID;
				})
			);
		}
	};
	//Returns total amount of the cart
	const CartAmount = () => {
		let totalAmount = globalCart.reduce(
			(acc, item) => acc + Number.parseInt(item.amount * item.phoneItems),
			0
		);
		return totalAmount;
	};

	//Returns total items available in the cart
	const CartTotalItems = () => {
		let totalItemsInCart = globalCart.reduce(
			(acc, item) => acc + Number.parseInt(item.phoneItems),
			0
		);
		return totalItemsInCart;
	};
	return (
		<CartContext.Provider
			value={{
				globalCart,
				setGlobalCart,
				handleAddCart,
				handleRemoveCart,
				CartAmount,
				CartTotalItems,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export default CartProvider;
