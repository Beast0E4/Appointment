const express = require("express");
const router = express.Router();

const { hasRole } = require("../middlewares/hasRole");
const appointmentController = require ("../controllers/appointment.controller")
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

router.get ("/slots", isUserAuthenticated, appointmentController.getAvailableSlots);
router.post ("/", isUserAuthenticated, appointmentController.bookAppointment);
router.patch ("/:appointmentId/status", isUserAuthenticated, hasRole("PROVIDER"), appointmentController.updateAppointmentStatus);
router.get ("/me", isUserAuthenticated, appointmentController.getMyAppointments);
router.get ("/provider", isUserAuthenticated, hasRole("PROVIDER"), appointmentController.getProviderBookings);
router.patch ("/:appointmentId/cancel", isUserAuthenticated, appointmentController.cancelAppointment);
router.patch ("/:appointmentId/reschedule", isUserAuthenticated, appointmentController.rescheduleAppointment);

module.exports = router;
