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
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

serviceSchema.index(
  { providerId: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("Service", serviceSchema);
