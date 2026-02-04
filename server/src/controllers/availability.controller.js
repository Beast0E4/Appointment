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
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.CREATED)
    .json(result.availability);
};

exports.getMyAvailability = async (req, res) => {
  const result = await availabilityService.getMyAvailability(req.user.id);

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.availability);
};
