// Import Express and HomeController
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/HomeController");

// Define Routes for functions in the HomeController
router.get("/", homeController.home);
router.get("/about", homeController.about);
router.get("/contact", homeController.contact);
router.get("/error", homeController.error);
router.get("/servererror", homeController.server_error);

// Make the module visible outside
module.exports = router;