const Appointment = require("../models/appointment.model");
const User = require("../models/user.model"); // Replaced ProviderProfile
const Service = require("../models/service.model");
const Availability = require("../models/availability.model");
const generateSlots = require("../utils/slotGenerator");

// Helper to match Date.getDay() with your Availability model strings
const dayMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const getDaySlots = async (serviceId, date) => {
  const response = {};

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      response.error = "Service not found";
      return response;
    }

    const dayOfWeek = new Date(date).getDay();

    const availability = await Availability.findOne({
      serviceId,
      dayOfWeek,
      isHoliday: false,
    });

    console.log (dayOfWeek);

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

    // 1️⃣ Fetch service to get providerId
    const service = await Service.findById(serviceId);
    if (!service) {
      response.error = "Service not found";
      return response;
    }

    const providerId = service.providerId;

    // 2️⃣ Parse date & time
    const dateObj = new Date(dateTime);

    const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    const startTime = dateObj.toTimeString().slice(0, 5); // HH:mm

    // Optional: calculate endTime from service duration
    const endDate = new Date(dateObj.getTime() + service.duration * 60000);
    const endTime = endDate.toTimeString().slice(0, 5);

    // 3️⃣ Check if slot is already taken for provider
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

    // 4️⃣ Check if user already has appointment at this time
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

    // 5️⃣ Create appointment
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

    // 1. Validate User is a Provider
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    // 2. Check if the appointment belongs to this Provider
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
    // Populate 'providerId' to get provider details from User model
    const appointments = await Appointment.find({ userId })
      .populate("serviceId")
      .populate("providerId", "name email") // Updated & selected fields
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
    // 1. Validate User is a Provider
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("PROVIDER")) {
      response.error = "Unauthorized: Provider access required";
      return response;
    }

    // 2. Find appointments where providerId matches userId
    const appointments = await Appointment.find({
      providerId: userId, // Updated from providerId
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

    // Allow cancellation if User is the owner OR User is the Provider
    const isOwner = appointment.userId.equals(userId);
    const isProvider = appointment.providerId.equals(userId);

    // Original logic was strict on PENDING status for users, 
    // but usually providers can cancel anytime.
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

    // Check for conflict at the new time for the SAME provider
    const conflict = await Appointment.findOne({
      providerId: appointment.providerId, // Updated
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
    appointment.status = "PENDING"; // Reset status to pending for approval

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