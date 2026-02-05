const Availability = require("../models/availability.model");
const User = require("../models/user.model");
const Service = require ("../models/service.model")

const createAvailability = async (userId, data) => {
  const response = {};

  try {
    const user = await User.findById(userId);
    if (!user) {
      response.error = "User not found";
      return response;
    }

    if (!user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Only providers can set availability";
      return response;
    }

    const existing = await Availability.findOne({
      serviceId: data.serviceId, 
      dayOfWeek: data.dayOfWeek,
    });

    const availability = await Availability.create(data);

    response.availability = availability;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getMyAvailability = async (userId, serviceId) => {
  const response = {};

  try {
    const service = await Service.findById(serviceId);
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    const availability = await Availability.find({
      serviceId,
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