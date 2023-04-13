const mongoose = require("mongoose");

const tmpPassSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  createdAt: { type: Date, expires: "10m", default: Date.now },
});

const tmpPass = mongoose.model("tmpPass", tmpPassSchema);
module.exports = tmpPass;
