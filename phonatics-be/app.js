const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const cors = require("cors");

const app = express();

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:"50mb", extended: true}));
app.use(upload.array());

app.use(
  cors({
    origin: "*",
  })
);


const mongodbURL = String(process.env.MONGO_URL);
mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log("Database is connected");
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log("Phonatics running on port", port);
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.status(200).send("Phonatics Backend");
});

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const smartPhoneRouter = require("./routes/smartPhone");
app.use("/smartphone", smartPhoneRouter);

