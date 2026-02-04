const Availability = require("../models/availability.model");
const Provider = require("../models/provider.model");

const createAvailability = async (userId, data) => {
  const response = {};

  try {
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const existing = await Availability.findOne({
      providerProfileId: provider._id,
      dayOfWeek: data.dayOfWeek,
    });

    if (existing) {
      response.error = "Availability already set for this day";
      return response;
    }

    const availability = await Availability.create({
      providerProfileId: provider._id,
      ...data,
    });

    response.availability = availability;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getMyAvailability = async (userId) => {
  const response = {};

  try {
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const availability = await Availability.find({
      providerProfileId: provider._id,
    });

    response.availability = availability;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

module.exports = {
  createAvailability,
  getMyAvailability,
};
