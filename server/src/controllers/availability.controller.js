const { StatusCodes } = require("http-status-codes");
const availabilityService = require("../services/availability.service");

exports.createAvailability = async (req, res) => {
  const result = await availabilityService.createAvailability(
    req.user.id,
    req.body
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: result.error });
  }

  return res
    .status(StatusCodes.CREATED)
    .json(result.availability);
};

exports.getMyAvailability = async (req, res) => {
  const result = await availabilityService.getMyAvailability(
    req.user.id, 
    req.params.serviceId
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.availability);
};

exports.updateAvailability = async (req, res) => {
  const result = await availabilityService.updateAvailability(
    req.user.id,
    req.params.availabilityId,
    req.body
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.availability);
};

exports.deleteAvailability = async (req, res) => {
  const result = await availabilityService.deleteAvailability(
    req.user.id,
    req.params.availabilityId
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json({ message: result.message });
};