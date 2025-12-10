const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 5 }, // 5 minutes
});

const OTPModel = mongoose.model("OTPModel", OTPSchema);

module.exports = OTPModel;