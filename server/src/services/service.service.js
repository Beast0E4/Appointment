const Service = require("../models/service.model");
const User = require("../models/user.model");
const Availability = require("../models/availability.model")
const Appointment = require("../models/appointment.model")

const createService = async (userId, data) => {
  const response = {};

  try {
    const user = await User.findById(userId);
    if (!user) {
      response.error = "User not found";
      return response;
    }

    const service = await Service.create({
      providerId: user._id,
      name: data.name.toUpperCase(),
      description: data.description,
      duration: data.duration,
      price: data.price,
    });

    response.service = service;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getAllServices = async (userId) => {
  const response = {};

  try {
    const services = await Service.find({ providerId: { $ne: userId } })
      .populate("providerId", "name email");

    response.services = services;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getMyServices = async (userId) => {
  const response = {};

  try {
    const user = await User.findById(userId);
    if (!user) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    const services = await Service.find({
      providerId: userId,
    });

    response.services = services;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const updateService = async (userId, serviceId, data) => {
  const response = {};

  try {
    const user = await User.findById(userId);
    if (!user) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    const service = await Service.findOne({
      _id: serviceId,
      providerId: userId,
    });

    if (!service) {
      response.error = "Service not found or unauthorized";
      return response;
    }

    Object.assign(service, data);
    await service.save();

    response.service = service;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const deleteService = async (userId, serviceId) => {
  const response = {};

  try {
    const user = await User.findById(userId);
    if (!user) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    const deletedService = await Service.findOneAndDelete({
      _id: serviceId,
      providerId: userId,
    });

    if (!deletedService) {
      response.error = "Service not found or unauthorized";
      return response;
    }

    await Availability.deleteMany({ serviceId: serviceId });

    await Appointment.deleteMany({ serviceId: serviceId });

    response.message = "Service and all associated availability and appointments permanently deleted";
    return response;

  } catch (error) {
    console.error("Delete Service Error:", error);
    response.error = error.message;
    return response;
  }
};


module.exports = {
  createService,
  getMyServices,
  updateService,
  deleteService,
  getAllServices
};