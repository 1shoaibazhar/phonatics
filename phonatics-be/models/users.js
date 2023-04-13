const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  city: String,
  type: String,
});

const user = mongoose.model("user", userSchema);
module.exports = user;