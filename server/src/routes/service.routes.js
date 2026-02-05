const express = require("express");
const router = express.Router();

const { hasRole } = require("../middlewares/hasRole");
const serviceController = require("../controllers/service.controller");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

router.post("/", isUserAuthenticated, hasRole("PROVIDER"), serviceController.createService);
router.get("/", isUserAuthenticated, hasRole("PROVIDER"), serviceController.getMyServices);
router.get("/all", isUserAuthenticated, serviceController.getAllServices);
router.delete("/:serviceId", isUserAuthenticated, hasRole("PROVIDER"), serviceController.deleteService);
router.patch("/:serviceId", isUserAuthenticated, hasRole("PROVIDER"), serviceController.updateService);

module.exports = router;