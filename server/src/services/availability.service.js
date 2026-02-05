const Availability = require("../models/availability.model");
const User = require("../models/user.model"); // Import User model
const Service = require ("../models/service.model")

const createAvailability = async (userId, data) => {
  const response = {};

  try {
    // 1. Validate User and Role
    const user = await User.findById(userId);
    if (!user) {
      response.error = "User not found";
      return response;
    }

    if (!user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Only providers can set availability";
      return response;
    }

    // 2. Check if availability already exists for this User on this Day
    // Note: 'providerProfileId' is replaced by 'providerId' to link directly to User
    const existing = await Availability.findOne({
      serviceId: data.serviceId, 
      dayOfWeek: data.dayOfWeek,
    });

    if (existing) {
      // Logic from your snippet: prevents multiple slots on the same day
      // If you want multiple slots (e.g. 9-12 and 2-5), remove this check.
      response.error = "Availability already set for this day";
      return response;
    }

    // 3. Create Availability
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
    // 1. Validate User and Role
    const service = await Service.findById(serviceId);
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    // 2. Fetch availability for this User
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