const Availability = require("../models/availability.model");
const User = require("../models/user.model");
const Service = require("../models/service.model");

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

    const service = await Service.findById(data.serviceId);
    if (!service) {
      response.error = "Service not found";
      return response;
    }

    if (!service.providerId.equals(userId)) {
      response.error = "Unauthorized: You do not own this service";
      return response;
    }

    if (parseInt(data.slotDuration) < parseInt(service.duration)) {
      response.error = `Slot duration (${data.slotDuration}m) cannot be less than the service duration (${service.duration}m)`;
      return response;
    }

    const availability = await Availability.create(data);

    response.availability = availability;
    return response;

  } catch (error) {
    console.error("Create Availability Error:", error);
    response.error = error.message;
    return response;
  }
};

const getMyAvailability = async (userId, serviceId) => {
  const response = {};

  try {
    const service = await Service.findById(serviceId);
    
    if (!service) {
        response.error = "Service not found";
        return response;
    }

    if (!service.providerId.equals(userId)) {
      response.error = "Unauthorized: You can only view your own service availability";
      return response;
    }

    const availability = await Availability.find({
      serviceId,
    }).sort({ dayOfWeek: 1 });

    response.availability = availability;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const updateAvailability = async (userId, availabilityId, data) => {
  const response = {};

  try {
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      response.error = "Availability slot not found";
      return response;
    }

    const service = await Service.findById(availability.serviceId);
    if (!service) {
        response.error = "Associated service not found";
        return response;
    }

    if (!service.providerId.equals(userId)) {
      response.error = "Unauthorized: You do not own this availability slot";
      return response;
    }

    if (data.slotDuration && parseInt(data.slotDuration) < parseInt(service.duration)) {
      response.error = `Slot duration (${data.slotDuration}m) cannot be less than the service duration (${service.duration}m)`;
      return response;
    }

    const updatedAvailability = await Availability.findByIdAndUpdate(
      availabilityId,
      { $set: data },
      { new: true, runValidators: true }
    );

    response.availability = updatedAvailability;
    return response;

  } catch (error) {
    console.error("Update Availability Error:", error);
    response.error = error.message;
    return response;
  }
};

const deleteAvailability = async (userId, availabilityId) => {
  const response = {};

  try {
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      response.error = "Availability slot not found";
      return response;
    }

    const service = await Service.findById(availability.serviceId);

    if (service && !service.providerId.equals(userId)) {
      response.error = "Unauthorized: You do not own this availability slot";
      return response;
    }

    await Availability.findByIdAndDelete(availabilityId);

    response.success = true;
    response.message = "Availability slot deleted successfully";
    return response;

  } catch (error) {
    console.error("Delete Availability Error:", error);
    response.error = error.message;
    return response;
  }
};

module.exports = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability
};