const { StatusCodes } = require("http-status-codes");
const serviceService = require("../services/service.service");

exports.createService = async (req, res) => {
  const result = await serviceService.createService(req.user.id, req.body);

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.CREATED)
    .json(result.service);
};

exports.getMyServices = async (req, res) => {
  const result = await serviceService.getMyServices(req.user.id);

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.services);
};

exports.updateService = async (req, res) => {
  const { serviceId } = req.params;
  const result = await serviceService.updateService(
    req.user.id,
    serviceId,
    req.body
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.service);
};

exports.deleteService = async (req, res) => {
  const { serviceId } = req.params;
  const result = await serviceService.deleteService(
    req.user.id,
    serviceId
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json({ message: result.message });
};
