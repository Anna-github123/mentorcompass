// Import Express and HomeController
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

// Define Routes for functions in the AdminController
router.post("/login", adminController.login);
router.get("/login", adminController.adminlogin);
router.get("/dashboard", adminController.dashboard);
router.get("/admindashboard", adminController.admindashboard);
router.get("/viewoppurtunity", adminController.viewoppurtunity);
router.get("/addmentor", adminController.get_add_mentor);
router.post("/addmentor", adminController.add_mentor);
router.post("/addopportunity", adminController.add_opportunity);
router.delete("/deleteopportunity/:id", adminController.delete_opportunity);
router.put("/updatestudent/:id", adminController.modify_student_record);
router.put("/updatementor/:id", adminController.modify_mentor_record);
router.delete("/deletestudent/:id", adminController.delete_student_record);
router.delete("/deletementor/:id", adminController.delete_mentor_record);
router.get("/logout", adminController.logout);
router.get("/modifymentor", adminController.get_modify_mentor);

// Make the module visible outside
module.exports = router;
