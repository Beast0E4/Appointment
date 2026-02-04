const Provider = require("../models/provider.model");
const User = require("../models/user.model");

const createProviderProfile = async (userId, data) => {
  const response = {};

  try {
    if (!userId) {
      response.error = "Unauthorized";
      return response;
    }

    const existingProvider = await Provider.findOne({ userId });
    if (existingProvider) {
      response.error = "Provider profile already exists";
      return response;
    }

    const providerProfile = await Provider.create({
      userId,
      businessName: data.businessName,
      description: data.description,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { roles: "PROVIDER" },
    });

    response.providerProfile = providerProfile;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getProviderProfileByUserId = async (userId) => {
  const response = {};

  try {
    if (!userId) {
      response.error = "Unauthorized";
      return response;
    }

    const providerProfile = await Provider.findOne({ userId });

    if (!providerProfile) {
      response.error = "Provider profile not found";
      return response;
    }

    response.providerProfile = providerProfile;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

module.exports = {
  createProviderProfile,
  getProviderProfileByUserId,
};
