const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const smartPhone = require("../models/smartPhone");
const users = require("../models/users");
const run = require("nodemon/lib/monitor/run");
const { trusted } = require("mongoose");
const order = require("../models/order");

// SmartPhone addition API
router.post(
	"/add",
	[
		check("img").exists().withMessage("Seller Id is required"),
		check("phoneName").exists().withMessage("Model Name is required"),
		check("availability").exists().withMessage("Availability is required"),
		check("phoneDesc").exists().withMessage("Description is required"),
		check("companyName").exists().withMessage("Company Name is required"),
		check("amount").exists().withMessage("Price is required"),
		check("network").exists().withMessage("Network is required"),
		check("body").exists().withMessage("Body is required"),
		check("display").exists().withMessage("Display is required"),
		check("platform").exists().withMessage("Platform is required"),
		check("ram").exists().withMessage("Memory is required"),
		check("mainCamera").exists().withMessage("Main Camera is required"),
		check("selfieCamera").exists().withMessage("Selfie Camera is required"),
		check("weight").exists().withMessage("Weight is required"),
		check("battery").exists().withMessage("Battery is required"),
		check("others").exists().withMessage("Others is required"),
		check("sellerId").exists().withMessage("Seller Id is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			req.body.availability = Number(req.body.availability);
			let newSmartPhone = new smartPhone(req.body);
			newSmartPhone
				.save()
				.then(() => {
					res.status(200).send("SmartPhone added successfully");
				})
				.catch((err) => {
					res.status(400).send("Item was not saved to the database");
					console.log(err);
				});
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

// API to update a given smartphone device
router.put(
	"/update",
	[
		check("phoneID").exists().withMessage("Phone ID is required"),
		check("img").exists().withMessage("Seller Id is required"),
		check("phoneName").exists().withMessage("Model Name is required"),
		check("availability").exists().withMessage("Availability is required"),
		check("phoneDesc").exists().withMessage("Description is required"),
		check("companyName").exists().withMessage("Company Name is required"),
		check("amount").exists().withMessage("Price is required"),
		check("network").exists().withMessage("Network is required"),
		check("body").exists().withMessage("Body is required"),
		check("display").exists().withMessage("Display is required"),
		check("platform").exists().withMessage("Platform is required"),
		check("ram").exists().withMessage("Memory is required"),
		check("mainCamera").exists().withMessage("Main Camera is required"),
		check("selfieCamera").exists().withMessage("Selfie Camera is required"),
		check("weight").exists().withMessage("Weight is required"),
		check("battery").exists().withMessage("Battery is required"),
		check("others").exists().withMessage("Others is required"),
		check("sellerId").exists().withMessage("Seller Id is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			let newObj = {};

			newObj.img = req.body.img;
			newObj.phoneName = req.body.phoneName;
			newObj.availability = req.body.availability;
			newObj.phoneDesc = req.body.phoneDesc;
			newObj.companyName = req.body.companyName;
			newObj.amount = req.body.amount;
			newObj.network = req.body.network;
			newObj.body = req.body.body;
			newObj.display = req.body.display;
			newObj.platform = req.body.platform;
			newObj.ram = req.body.ram;
			newObj.mainCamera = req.body.mainCamera;
			newObj.selfieCamera = req.body.selfieCamera;
			newObj.weight = req.body.weight;
			newObj.battery = req.body.battery;
			newObj.others = req.body.others;
			newObj.sellerId = req.body.sellerId;

			_phoneID = req.body.phoneID;

			smartPhone
				.findByIdAndUpdate({ _id: _phoneID }, newObj)
				.then(() => {
					res.status(200).send("SmartPhone updated successfully");
				})
				.catch((err) => {
					console.log(err);

					res.status(400).send("SmartPhone was not updated successfully");
				});
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

// API to delete a smartphone device
router.post("/delete", (req, res) => {
	const phoneID = req.body.phoneID;
	smartPhone
		.findByIdAndDelete({ _id: phoneID })
		.then(() => {
			res.status(200).send("SmartPhone deleted successfully");
		})
		.catch((err) => {
			console.log("Unable to delete smartphone");
			console.log(err);
			res.status(400).send("Unable to delete smartphone");
		});
});

// Function to convert phone to a specific format
function fetchPhone(phone) {
	return new Promise((resolve, reject) => {
		run2();
		async function run2() {
			try {
				const sellerReturned = await users.findOne({
					userName: phone.sellerId,
				});

				let newObj = {};

				newObj.img = phone.img;
				newObj.phoneName = phone.phoneName;
				newObj.phoneID = phone._id;
				newObj.availability = Number(phone.availability);
				newObj.phoneDesc = phone.phoneDesc;
				newObj.seller = sellerReturned.name;
				newObj.sellerLocation = sellerReturned.city;
				newObj.sellerId = sellerReturned.userName;
				newObj.companyName = phone.companyName;
				newObj.amount = phone.amount;
				newObj.features = {
					network: phone.network,
					body: phone.body,
					display: phone.display,
					platform: phone.platform,
					ram: phone.ram,
					mainCamera: phone.mainCamera,
					selfieCamera: phone.selfieCamera,
					weight: phone.weight,
					battery: phone.battery,
					others: phone.others,
				};

				resolve(newObj);
			} catch (err) {
				console.log("Error while getting seller for smartphone");
				reject(err);
			}
		}
	});
}

// API to search for all mobile devices of the name given
router.get("/getAll/:name", (req, res) => {
	const smartPhoneName = req.params.name;
	run();
	async function run() {
		try {
			const phones = await smartPhone.find({
				phoneName: { $regex: smartPhoneName, $options: "i" },
			});
			if (phones) {
				run3();
				async function run3() {
					let promises = [];
					let returnArray = [];
					phones.forEach((phone) => {
						promises.push(fetchPhone(phone));
					});

					await Promise.all(promises).then((data) => {
						returnArray = data;
					});

					res.status(200).send(returnArray);
				}
			} else {
				res.status(200).send("Phones not found");
			}
		} catch {
			res.status(404).send("Error while fetching from database");
		}
	}
});

// API to get the devices posted by the seller
router.get("/getSellerPhones/:name", (req, res) => {
	const sellerUserName = req.params.name;
	run();
	async function run() {
		try {
			const phones = await smartPhone.find({ sellerId: sellerUserName });
			if (phones) {
				run3();
				async function run3() {
					let promises = [];
					let returnArray = [];
					phones.forEach((phone) => {
						promises.push(fetchPhone(phone));
					});

					await Promise.all(promises).then((data) => {
						returnArray = data;
					});
					res.status(200).send(returnArray);
				}
			} else {
				res.status(200).send("Phones not found");
			}
		} catch (err) {
			res.status(404).send("Error while fetching from databse");
		}
	}
});

function reduceAvailability(phoneId) {
	return new Promise((reject, resolve) => {
		run();
		async function run() {
			try {
				let smartphoneDevice = await smartPhone.findOne({ _id: phoneId });
				smartphoneDevice.availability = smartphoneDevice.availability - 1;
				await smartPhone.findByIdAndUpdate(phoneId, smartphoneDevice);
			} catch (err) {
				console.log("Error while reducing availability");
				console.log(err);
				reject(err);
			}
		}
	});
}

// API for placing order
router.post("/placeOrder", (req, res) => {
	requestObj = req.body;

	let newObj = new order();
	newObj.orderingDate = requestObj.orderingDate;
	newObj.shippingDate = requestObj.shippingDate;
	newObj.shippingAddress = requestObj.shippingAddress;
	newObj.buyerUserName = requestObj.buyerUserName;
	newObj.orderStatus = requestObj.orderStatus;
	newObj.totalAmount = requestObj.totalAmount;
	newObj.buyerPhoneNumber = requestObj.buyerPhoneNumber;

	let phoneIds = Object.keys(requestObj.orderItems);

	let orderedPhones = phoneIds.map((id) => {
		reduceAvailability(id);
		return requestObj.orderItems[id][0];
	});

	let sellers = phoneIds.map((id) => {
		return requestObj.orderItems[id][1];
	});

	newObj.sellerIds = sellers;

	newObj.devices = orderedPhones;

	newObj
		.save()
		.then(() => {
			res.status(200).send("Ordered");
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

// API to search for 5 phones to show on home page
router.get("/getSomePhones", (req, res) => {
	run();
	async function run() {
		try {
			// const phones = await smartPhone.find({
			//   phoneName: { $regex: smartPhoneName, $options: "i" },
			// });
			const phones = await smartPhone.aggregate([{ $sample: { size: 5 } }]);
			if (phones) {
				run3();
				async function run3() {
					let promises = [];
					let returnArray = [];
					phones.forEach((phone) => {
						promises.push(fetchPhone(phone));
					});

					await Promise.all(promises).then((data) => {
						returnArray = data;
					});

					res.status(200).send(returnArray);
				}
			} else {
				res.status(200).send("Phones not found");
			}
		} catch {
			res.status(404).send("Error while fetching from database");
		}
	}
});

module.exports = router;
