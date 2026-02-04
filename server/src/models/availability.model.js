const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    providerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "17:00"
    slotDuration: { type: Number, required: true }, // minutes
    isHoliday: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
