const Appointment = require("../models/appointment.model");
const ProviderProfile = require("../models/provider.model");
const Service = require("../models/service.model");
const Availability = require("../models/availability.model");
const generateSlots = require("../utils/slotGenerator");

const getAvailableSlots = async (providerProfileId, serviceId, date) => {
  const response = {};

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      response.error = "Service not found";
      return response;
    }

    const dayOfWeek = new Date(date).getDay();

    const availability = await Availability.findOne({
      providerProfileId,
      dayOfWeek,
      isHoliday: false,
    });

    if (!availability) {
      response.slots = [];
      return response;
    }

    const allSlots = generateSlots(
      availability.startTime,
      availability.endTime,
      service.duration
    );

    const bookedAppointments = await Appointment.find({
      providerProfileId,
      date,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    const bookedSlots = bookedAppointments.map(a => a.startTime);

    response.slots = allSlots.filter(
      slot => !bookedSlots.includes(slot.startTime)
    );

    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const bookAppointment = async (userId, data) => {
  const response = {};

  try {
    const { providerProfileId, serviceId, date, startTime, endTime } = data;

    const conflict = await Appointment.findOne({
      providerProfileId,
      date,
      startTime,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    if (conflict) {
      response.error = "Time slot already booked";
      return response;
    }

    const userConflict = await Appointment.findOne({
      userId,
      date,
      startTime,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    if (userConflict) {
      response.error = "You already have an appointment at this time";
      return response;
    }

    const appointment = await Appointment.create({
      userId,
      providerProfileId,
      serviceId,
      date,
      startTime,
      endTime,
    });

    response.appointment = appointment;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const updateAppointmentStatus = async (userId, appointmentId, status) => {
  const response = {};

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      response.error = "Appointment not found";
      return response;
    }

    const provider = await ProviderProfile.findOne({ userId });
    if (!provider || !appointment.providerProfileId.equals(provider._id)) {
      response.error = "Unauthorized";
      return response;
    }

    appointment.status = status;
    await appointment.save();

    response.appointment = appointment;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getUserAppointments = async (userId) => {
  const response = {};

  try {
    const appointments = await Appointment.find({ userId })
      .populate("serviceId")
      .populate("providerProfileId")
      .sort({ date: 1, startTime: 1 });

    response.appointments = appointments;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const getProviderAppointments = async (userId) => {
  const response = {};

  try {
    const provider = await ProviderProfile.findOne({ userId });
    if (!provider) {
      response.error = "Provider profile not found";
      return response;
    }

    const appointments = await Appointment.find({
      providerProfileId: provider._id,
    })
      .populate("serviceId")
      .populate("userId")
      .sort({ date: 1, startTime: 1 });

    response.appointments = appointments;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const cancelAppointment = async (userId, appointmentId) => {
  const response = {};

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      response.error = "Appointment not found";
      return response;
    }

    if (
      !appointment.userId.equals(userId) &&
      appointment.status !== "PENDING"
    ) {
      response.error = "You cannot cancel this appointment";
      return response;
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    response.appointment = appointment;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

const rescheduleAppointment = async (userId, appointmentId, data) => {
  const response = {};

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      response.error = "Appointment not found";
      return response;
    }

    if (!appointment.userId.equals(userId)) {
      response.error = "Unauthorized";
      return response;
    }

    const conflict = await Appointment.findOne({
      providerProfileId: appointment.providerProfileId,
      date: data.date,
      startTime: data.startTime,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    if (conflict) {
      response.error = "New time slot not available";
      return response;
    }

    appointment.date = data.date;
    appointment.startTime = data.startTime;
    appointment.endTime = data.endTime;
    appointment.status = "PENDING";

    await appointment.save();

    response.appointment = appointment;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  updateAppointmentStatus,
  getUserAppointments,
  getProviderAppointments,
  cancelAppointment,
  rescheduleAppointment,
};
