const Service = require("../models/service.model");
const Provider = require("../models/provider.model");

const createService = async (userId, data) => {
  const response = {};

  try {
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const service = await Service.create({
      providerProfileId: provider._id,
      name: data.name,
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

const getMyServices = async (userId) => {
  const response = {};

  try {
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const services = await Service.find({
      providerProfileId: provider._id,
      isActive: true,
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
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const service = await Service.findOne({
      _id: serviceId,
      providerProfileId: provider._id,
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
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const service = await Service.findOne({
      _id: serviceId,
      ProviderId: provider._id,
    });

    if (!service) {
      response.error = "Service not found or unauthorized";
      return response;
    }

    service.isActive = false;
    await service.save();

    response.message = "Service deleted successfully";
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
};
