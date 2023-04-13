const mongoose = require("mongoose");

const smartPhoneSchema = new mongoose.Schema({
  img: String,
  phoneName: String,
  availability: Number,
  phoneDesc: String,
  companyName: String,
  amount: Number,
  network: String,
  body: String,
  display: String,
  platform: String,
  ram: String,
  mainCamera: String,
  selfieCamera: String,
  weight: String,
  battery: String,
  others: String,
  sellerId: String,
});

const smartPhone = mongoose.model("smartPhone", smartPhoneSchema);
module.exports = smartPhone;
