const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const generator = require("generate-password");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const CLIENT_ID = String(process.env.CLIENT_ID);
const CLIENT_SECRET = String(process.env.CLIENT_SECRET);
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
	"1//04R9gLoFcfBO4CgYIARAAGAQSNwF-L9Ir8MrGq58ZZ9ub2zBrD2kiOfXxBSObzZIV11KRMFw9yucRphxmAlUoZ51TLzgJcYsvI6I";

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const user = require("../models/users");
const tmpPass = require("../models/tmpPass");
const { run } = require("googleapis/build/src/apis/run");

// router.get("/", (req, res) => {
//   res.send("All Users");
// });

router.post(
	"/add",
	[
		check("name").exists().withMessage("Name is required"),
		check("email").exists().withMessage("Email is required"),
		check("userName").exists().withMessage("UserName is required"),
		check("password").exists().withMessage("Password is required"),
		check("city").exists().withMessage("City is required"),
		check("type").exists().withMessage("Type is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			let newUser = new user(req.body);
			newUser
				.save()
				.then(() => {
					res.status(200).send("User added successfully");
				})
				.catch((err) => {
					if (err.code === 11000) {
						res.status(409).send("UserName Already exists");
						console.log(err);
					} else {
						res.status(400).send("Item was not saved to the database");
						console.log(err);
					}
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

// Authenticating password
router.post(
	"/authenticate",
	[
		check("userName").exists().withMessage("UserName is required"),
		check("password").exists().withMessage("Password is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const { userName, password } = req.body;
			run();
			async function run() {
				try {
					const userObj = await user.findOne({ userName, password });
					if (userObj) {
						res.status(200).send(userObj);
					} else {
						res.status(200).send("User not found");
					}
				} catch {
					res.status(404).send("Error while fetching from database");
				}
			}
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

// Sending temporary password to email and database
router.post(
	"/tempPass",
	[check("userName").exists().withMessage("UserName is required")],
	(req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const { userName } = req.body;
			run();
			async function run() {
				try {
					const userObj = await user.findOne({ userName });
					if (userObj) {
						const temporaryPass = generator.generate({
							length: 10,
							numbers: true,
						});

						let query = {};
						let update = { password: temporaryPass, userName };
						let options = {
							upsert: true,
							new: true,
						};
						try {
							await tmpPass.findOneAndUpdate(query, update, options);
						} catch (err) {
							console.log("Error while setting temporary password");
						}

						async function main() {
							try {
								const accessToken = await oAuth2Client.getAccessToken();
								let transporter = nodemailer.createTransport({
									service: "gmail",
									auth: {
										type: "OAuth2",
										user: "phonaticsapp@gmail.com",
										clientId: CLIENT_ID,
										clientSecret: CLIENT_SECRET,
										refreshToken: REFRESH_TOKEN,
										accessToken: accessToken,
									},
								});

								await transporter.sendMail({
									from: "SupportTeam Phonatics <phonaticsapp@gmail.com>",
									to: String(userObj.email),
									subject: "Reset Your Phonatics Password",
									text: `Dear Customer, You temporary password is = ${temporaryPass}`,
									html: `<p>Dear Customer, You temporary password is = ${temporaryPass}</p>`,
								});
							} catch (error) {
								console.log(error);
							}
						}

						main().catch(console.error);
						res.status(200).send("Email sent successfully");
					} else {
						res.status(200).send("User not found");
					}
				} catch {
					res.status(404).send("Error while fetching from database");
				}
			}
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

router.post(
	"/authenticateTemp",
	[
		check("userName").exists().withMessage("UserName is required"),
		check("password").exists().withMessage("Password is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const { userName, password } = req.body;
			run();
			async function run() {
				try {
					const tmpObj = await tmpPass.findOne({ userName, password });
					if (tmpObj) {
						const userObj = await user.findOne({ userName });
						res.status(200).send(userObj);
					} else {
						res.status(200).send("Temporary password not found");
					}
				} catch {
					res.status(404).send("Error while fetching from database");
				}
			}
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

router.post(
	"/resetPass",
	[
		check("userName").exists().withMessage("UserName is required"),
		check("password").exists().withMessage("Password is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		const { userName, password } = req.body;
		console.log(req.body);
		if (errors.isEmpty()) {
			run();
			async function run() {
				try {
					const userObj = await user.findOneAndUpdate(
						{ userName: userName },
						{ userName: userName, password: password }
					);
					if (userObj) {
						res.status(200).send("Password updated successfully");
						try {
							await tmpPass.findOneAndDelete({ userName });
						} catch (err) {
							console.log("Temporary password not deleted");
							console.log(err);
						}
					} else {
						res.status(200).send("User not found");
					}
				} catch (err) {
					console.log("Password not updated succesfully");
					console.log(err);
				}
			}
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

router.put(
	"/update",
	[
		check("name").exists().withMessage("Name is required"),
		check("email").exists().withMessage("Email is required"),
		check("userName").exists().withMessage("UserName is required"),
		check("password").exists().withMessage("Password is required"),
		check("city").exists().withMessage("City is required"),
		check("type").exists().withMessage("Type is required"),
	],
	(req, res) => {
		const errors = validationResult(req);
		const { name, email, userName, password, city, type } = req.body;
		console.log(req.body);
		if (errors.isEmpty()) {
			run();
			async function run() {
				try {
					const userObj = await user.findOneAndUpdate(
						{ userName: userName },
						{ name, email, userName, password, city, type }
					);
					if (userObj) {
						res.status(200).send("User updated successfully");
					} else {
						res.status(200).send("User not found");
					}
				} catch (err) {
					console.log("User not updated succesfully");
					console.log(err);
				}
			}
		} else {
			let errorMessages = [];
			errors.array().forEach((error) => {
				errorMessages.push(error.msg);
			});
			res.status(400).send(errorMessages);
		}
	}
);

// router.get("/:id", (req, res) => {
//   const userID = req.params.id;
//   res.send("User with id");
// });

module.exports = router;
