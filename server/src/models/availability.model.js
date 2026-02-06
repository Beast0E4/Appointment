const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true },
    isHoliday: { type: Boolean, default: false },
  },
  { timestamps: true }
);

availabilitySchema.index(
  { serviceId: 1, dayOfWeek: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
