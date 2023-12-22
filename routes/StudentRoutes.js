// Import Express and StudentController
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/StudentController");

// Define Routes for functions in the StudentController
router.post("/signup", studentController.signup);
router.get("/signup", studentController.studentsignup);
router.post("/login", studentController.login);
router.get("/login", studentController.studentlogin);
router.get("/forgotten", studentController.forgottenpassword);
router.get("/studentdashboard", studentController.studentdashboard);
router.get("/dashboard", studentController.dashboard);
router.post("/addparticipation", studentController.add_participation);
router.get("/addparticipation", studentController.get_add_participation);
router.get("/modifyparticipation", studentController.get_modify_participation);
router.put("/modifyparticipation/:id", studentController.modify_participation);
router.delete("/deleteparticipation/:id",studentController.delete_participation);
router.get("/logout", studentController.logout);

// Make the module visible outside
module.exports = router;
