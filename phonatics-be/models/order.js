const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerPhoneNumber: String,
  buyerUserName: String,
  sellerIds: [
    {
      type: String,
    },
  ],
  devices: [
    {
      type: String,
    },
  ],
  orderStatus: String,
  orderingDate: Date,
  shippingAddress: String,
  shippingDate: Date,
  totalAmount: Number,
});

const order = mongoose.model("order", orderSchema);
module.exports = order;
