const { StatusCodes } = require("http-status-codes");
const providerService = require("../services/provider.service");

exports.createProviderProfile = async (req, res) => {
  try {
    const providerProfile = await providerService.createProviderProfile(
      req.user.id,
      req.body
    );

    res.status(StatusCodes.CREATED).json({
      message: "Provider profile created successfully",
      providerProfile: providerProfile.providerProfile,
    });
  } catch (err) {
    if (err.message === "PROVIDER_ALREADY_EXISTS") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Provider profile already exists",
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

exports.getMyProviderProfile = async (req, res) => {
  try {
    const profile = await providerService.getProviderProfileByUserId(
      req.user.id
    );
    res.json(profile);
  } catch (err) {
    if (err.message === "PROVIDER_NOT_FOUND") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Provider profile not found",
      });
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};
