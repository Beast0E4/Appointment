const Service = require("../models/service.model");
const User = require("../models/user.model"); // Import User model

const createService = async (userId, data) => {
  const response = {};

  try {
    // 1. Validate User and Role
    const user = await User.findById(userId);
    if (!user) {
      response.error = "User not found";
      return response;
    }

    if (!user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: You must be a Provider to create services";
      return response;
    }

    // 2. Create Service linked directly to the User (Provider)
    const service = await Service.create({
      providerId: user._id, // Using the User's ID directly
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

const getAllServices = async () => {
  const response = {};

  try {
    const services = await Service.find()
      .populate("providerId", "name email")

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
    // 1. Validate User and Role
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    // 2. Fetch services belonging to this user
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
    // 1. Validate User and Role
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    // 2. Find and update
    const service = await Service.findOne({
      _id: serviceId,
      providerId: userId, // Ensure ownership
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
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    const deletedService = await Service.findOneAndDelete({
      _id: serviceId,
      providerId: userId, // Ensure ownership
    });

    if (!deletedService) {
      response.error = "Service not found or unauthorized";
      return response;
    }

    response.message = "Service permanently deleted";
    return response;

  } catch (error) {
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