const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    providerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
    },
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
