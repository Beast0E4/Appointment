const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const Service = require("../models/service.model");
const Availability = require("../models/availability.model");
const generateSlots = require("../utils/slotGenerator");

const getDaySlots = async (serviceId, date) => {
  const response = {};

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      response.error = "Service not found";
      return response;
    }

    const dayOfWeek = new Date(date).getDay();

    const availabilities = await Availability.find({
      serviceId,
      dayOfWeek,
      isHoliday: false,
    });

    if (!availabilities || availabilities.length === 0) {
      response.slots = [];
      return response;
    }

    let allSlots = [];

    for (const availability of availabilities) {
      const slots = generateSlots(
        availability.startTime,
        availability.endTime,
        service.duration
      );
      allSlots = allSlots.concat(slots);
      console.log (allSlots);
    }

    const bookedAppointments = await Appointment.find({
      providerId: service.providerId,
      date,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    const bookedSet = new Set(
      bookedAppointments.map(a => a.startTime)
    );

    response.slots = allSlots.map(slot => ({
      ...slot,
      isAvailable: !bookedSet.has(slot.startTime),
    }));

    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};



const bookAppointment = async (userId, data) => {
  const response = {};

  try {
    const { serviceId, dateTime } = data;

    const service = await Service.findById(serviceId);
    if (!service) {
      response.error = "Service not found";
      return response;
    }

    const providerId = service.providerId;

    const dateObj = new Date(dateTime);

    const pad = (n) => String(n).padStart(2, "0");

    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const date = `${year}-${month}-${day}`;

    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    const startTime = `${hours}:${minutes}`;

    const endDate = new Date(dateObj.getTime() + service.duration * 60000);
    const endHours = pad(endDate.getHours());
    const endMinutes = pad(endDate.getMinutes());
    const endTime = `${endHours}:${endMinutes}`;

    const conflict = await Appointment.findOne({
      providerId,
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
      providerId,
      serviceId,
      date,
      startTime,
      endTime,
      status: "PENDING",
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

    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    if (!appointment.providerId.equals(userId)) {
      response.error = "Unauthorized: This appointment does not belong to you";
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
      .populate("providerId", "name email")
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
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    const appointments = await Appointment.find({
      providerId: userId,
    })
      .populate("serviceId")
      .populate("userId", "name email")
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

    const isOwner = appointment.userId.equals(userId);
    const isProvider = appointment.providerId.equals(userId);

    if (!isOwner && !isProvider) {
      response.error = "Unauthorized to cancel this appointment";
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
      providerId: appointment.providerId,
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
  getDaySlots,
  bookAppointment,
  updateAppointmentStatus,
  getUserAppointments,
  getProviderAppointments,
  cancelAppointment,
  rescheduleAppointment,
};