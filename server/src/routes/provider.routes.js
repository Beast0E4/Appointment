const express = require("express");
const router = express.Router();

const { hasRole } = require("../middlewares/hasRole");
const providerController = require("../controllers/provider.controller");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

router.post ("/profile", isUserAuthenticated, providerController.createProviderProfile);

router.get("/profile", isUserAuthenticated, hasRole("PROVIDER"), providerController.getMyProviderProfile);

module.exports = router;
