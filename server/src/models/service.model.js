const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, enum: ["DENTIST", "CAR RENTAL", "SALON"] },
    description: {type: String},
    duration: { type: Number, required: true }, // minutes
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
