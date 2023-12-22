// Import Express and MentorController
const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/MentorController");

// Define Routes for functions in the MentorController
router.post("/login", mentorController.login);
router.get("/login", mentorController.mentorlogin);
router.get("/dashboard", mentorController.dashboard);
router.get("/mentordashboard", mentorController.mentordashboard);
router.get("/logout", mentorController.logout);
router.get("/forgotten", mentorController.forgottenpassword);



// Make the module visible outside
module.exports = router;
