const { StatusCodes } = require("http-status-codes");
const appointmentService = require("../services/appointment.service");

exports.getAvailableSlots = async (req, res) => {
  const { providerProfileId, serviceId, date } = req.query;

  const result = await appointmentService.getAvailableSlots(
    providerProfileId,
    serviceId,
    date
  );

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.slots);
};

exports.bookAppointment = async (req, res) => {
  const result = await appointmentService.bookAppointment(
    req.user.id,
    req.body
  );

  if (result.error) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.CREATED)
    .json(result.appointment);
};

exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const result = await appointmentService.updateAppointmentStatus(
    req.user.id,
    appointmentId,
    status
  );

  if (result.error) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.appointment);
};

exports.getMyAppointments = async (req, res) => {
  const result = await appointmentService.getUserAppointments(req.user.id);

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.appointments);
};

exports.getProviderBookings = async (req, res) => {
  const result = await appointmentService.getProviderAppointments(req.user.id);

  if (result.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.appointments);
};

exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  const result = await appointmentService.cancelAppointment(
    req.user.id,
    appointmentId
  );

  if (result.error) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.appointment);
};

exports.rescheduleAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  const result = await appointmentService.rescheduleAppointment(
    req.user.id,
    appointmentId,
    req.body
  );

  if (result.error) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: result.error });
  }

  return res
    .status(StatusCodes.OK)
    .json(result.appointment);
};

