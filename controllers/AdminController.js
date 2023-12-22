// Import the Database instances from the db folder holding config.js and being inistialised in index.js
const { mentordb, admindb, opportunitydb, studentdb } = require("../db/config");
// Password encryption for authentication purposes
const bcrypt = require("bcrypt");
const express = require('express');
const session = require('express-session');
const app = express();

const generateSecretKey = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

app.use(
  session({
    secret: generateSecretKey(),
    resave: false,
    saveUninitialized: true,
  })
);



exports.adminlogin = function (req, res) {
  res.render("AdminLogin", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};


exports.viewoppurtunity = function (req, res) {
  res.render("ViewOpportunity", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};

exports.get_add_mentor = function (req, res) {
  res.render("AddMentor", {
    page_title: "Contact Page",
    contact_info: "Contact Us via email @ hello@mentorcompass.com"
});
};



exports.get_modify_mentor = function (req, res) {
  res.render("ModifyMentor", {
    page_title: "Contact Page",
    contact_info: "Contact Us via email @ hello@mentorcompass.com"
});
};


// Login function for admin
exports.login = async function (req, res) {
  const password = req.body.password;
  const email_address = req.body.email_address;
  const admin = await admindb.findByEmail(email_address);
  if (admin != null) {
    const valid_password = bcrypt.compareSync(password, admin.hash_password);
    if (valid_password) {
      console.log("Admin Found");
      req.session.role = "Admin";
      req.session.email_address = admin.email_address;
      req.session.admin_name = admin.name;
    
      
      res.redirect("/admin/admindashboard");
    } else {
      res.render("AdminLogin");
    }
  } else {
    res.redirect("/admin/login");
  }
};



exports.admindashboard = async function (req, res) {
  const role = "Admin";
  const email_adddres = "p.rich@gmail.com";
  const students = await studentdb.getStudents(email_adddres);
  const opportunities = await opportunitydb.getOpportunities();
  console.log(students);

  var studentsMap = new Map([]);
  for (let i = 0; i < students.length; i++) {
    var studentMentors = [];
    for (let j = 0; j < students[i].mentors.length; j++) {
      const mentor = await mentordb.findByEmail(students[i].mentors[j]);
      studentMentors.push(mentor);
    }
    console.log(studentMentors);
    studentsMap.set(students[i].email_address, studentMentors);
  }

  console.log(studentsMap);
  const mentors = await mentordb.getMentors();
  const AdminName = req.session.admin_name || "Guest";

  
  if (role == "Admin") {
    res.render("AdminDashboard", {
      opportunities: opportunities,
      students: students,
      AdminName: AdminName,
      mentors: mentors,
    });
  }
};


// Dashboard for admins to view student and mentor records
exports.dashboard = async function (req, res) {
  //const role = req.session.role; //should work for authentication
  //const email_address = req.session.email_address;
  const role = "Admin";
  const email_adddres = "p.rich@gmail.com";
  const students = await studentdb.getStudents(email_adddres);
  const opportunities = await opportunitydb.getOpportunities();

  var studentsMap = new Map([]);
  for (let i = 0; i < students.length; i++) {
    var studentMentors = [];
    for (let j = 0; j < students[i].mentors.length; j++) {
      const mentor = await mentordb.findByEmail(students[i].mentors[j]);
      studentMentors.push(mentor);
    }
    console.log(studentMentors);
    studentsMap.set(students[i].email_address, studentMentors);
  }

  console.log(studentsMap);
  const mentors = await mentordb.getMentors();
  if (role == "Admin") {
    res.render("AdminDashboard", {
      opportunities: opportunities,
      students: students,
      mentors: mentors,
    });
  }
};

// Add a mentor
exports.add_mentor = function (req, res) {
  const name = req.body.name_to_be_addressed;
  const email_address = req.body.email_address;
  // const students = req.body.students;
  mentordb.insertMentor(name, email_address);
  res.redirect("/admin/admindashboard");
  //const authenticatedEmail = req.session.email_address; // for legit authorization of admin
  //if (authenticatedEmail == null) {
  //res.redirect("/admin/login");
  //} else {
    //.insertMentor(name, email_address, students)
    //res.redirect("/admin/dashboard");
  //}
};

// Add an opportunity
exports.add_opportunity = function (req, res) {
  const category = req.body.category;
  const title = req.body.title;
  opportunitydb.insertOpportunity(category, title);
  res.redirect("/admin/dashboard");
};

// Delete an opportunity
exports.delete_opportunity = function (req, res) {
  const id = req.params.id;
  opportunitydb.deleteByID(id);
  res.redirect("/admin/dashboard");
  //const email_address = req.body.email_address;
  //if (email_address == null) {
  //  res.redirect("/student/login");
  //} else {
  //  await opportunitydb.deleteByID(id);
  //  res.redirect("/student/dashboard");
  //}
};

// modify student records
exports.modify_student_record = function (req, res) {
  const id = req.params.id;
  const email_address = req.body.email_address;
  studentdb.updateStudent(id, email_address);
  res.redirect("/admin/dashboard");
};

// modify mentor records
exports.modify_mentor_record = function (req, res) {
  const id = req.params.id;
  const email_address = req.body.email_address;
  mentordb.updateMentor(id, email_address);
  res.redirect("/admin/dashboard");
};

// Delete student records
exports.delete_student_record = function (req, res) {
  const id = req.params.id;
  studentdb.deleteByStudentID(id);
  res.redirect("/admin/dashboard");
};

// Delete mentor records
exports.delete_mentor_record = function (req, res) {
  const id = req.params.id;
  mentordb.deleteByMentorID(id);
  res.redirect("/admin/dashboard");
};

// Logs out student; only functional if an admin is logged in
exports.logout = function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logged Out");
    } else {
      res.redirect("/admin/login");
    }
  });
};