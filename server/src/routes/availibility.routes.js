const express = require("express");
const router = express.Router();

const { hasRole } = require("../middlewares/hasRole");
const availabilityController = require("../controllers/availability.controller");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

router.post("/", isUserAuthenticated, hasRole("PROVIDER"), availabilityController.createAvailability);
router.get("/", isUserAuthenticated, hasRole("PROVIDER"), availabilityController.getMyAvailability);

module.exports = router;
