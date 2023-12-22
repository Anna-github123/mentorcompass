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

// Login function for students
exports.login = async function (req, res) {
  const password = req.body.password;
  const email_address = req.body.email_address;
  const student = await studentdb.findByEmail(email_address);

  if (student != null) {
    const valid_password = bcrypt.compareSync(password, student.hash_password);

    if (valid_password) {
      console.log("Student Found");
      console.log(student.name);
      req.session.role = "Student";
      req.session.email_address = student.email_address;
      req.session.student_name = student.name;

      const studentName = req.session.student_name || "Guest";

      // res.render("StudentDashboard", { studentName });
      res.redirect("/student/dashboard")
    } else {
      // Render the login page with an error message
      res.render("StudentLogin", { error: "Invalid password" });
    }
  } else {
    // Render the login page with an error message
    res.render("StudentLogin", { error: "Student not found" });
  }
};



exports.studentlogin = function (req, res) {
  res.render("StudentLogin", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};

exports.studentdashboard = function (req, res) {
  res.render("StudentDashboard", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};



exports.forgottenpassword = function (req, res) {
  res.render("ForgotPassword", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};

// Sign Up function for only students
exports.signup = async function (req, res) {
  const name = req.body.name;
  const email_address = req.body.email_address;
  const password = req.body.password;
  const hash_password = bcrypt.hashSync(password, 10);
  const student = await studentdb.findByEmail(email_address);
  const opportunities = [];
  const mentors = [];
  console.log(student);
  
  if (student != null) {
    console.log("User");
  } else {
    await studentdb.insertStudent(
      name,
      email_address,
      hash_password,
      opportunities,
      mentors
    );
    req.session.role = "Student";
    req.session.email_address = email_address;

    // Render the studentSignup view
    res.render('studentSignup', { user: req.session });
  }
};

// Sign Up function for only students
exports.studentsignup = async function (req, res) {
  res.render("StudentSignUp", {
    page_title: "Contact Page",
    contact_info: "Contact Us via email @ hello@mentorcompass.com"
});
};


// Dashboard view for students; ideally displays the opportunities and mentors of the logged in student and is also able to display that it is directs to the ideal page
exports.dashboard = async (req, res) => {
  //const role = req.session.role; // Should work to a verify that a student is logged in
  //const email_address = req.session.email_address;
  const email_address = "y.xxx@gmail.com";
  const role = "Student";
  const allStudents = await studentdb.getStudents();

  const student = await studentdb.findByEmail(email_address);
  const allMentors = await mentordb.getMentors();
  const allOpportunities = await opportunitydb.getOpportunities();
  var studentMentors = [];
  var studentOpportunities = [];
  console.log(student);
  const studentName = req.session.student_name || "Guest";
  const studentEmail = req.session.email_address || "Guest";

  for (let i = 0; i < student.mentors.length; i++) {
    const mentor = await mentordb.findByEmail(student.mentors[i]);
    studentMentors.push(mentor);
  }

  for (let i = 0; i < student.opportunities.length; i++) {
    const opportunity = await opportunitydb.findByID(student.opportunities[i]);
    studentOpportunities.push(opportunity);
  }
  console.log(studentOpportunities);
  if (role == "Student") {
    res.render("StudentDashboard", {
      student: student,
      studentName: studentName,
      allStudents: allStudents,
      allMentors: allMentors,
      studentEmail: studentEmail,
      allOpportunities: allOpportunities,
      studentOpportunities: studentOpportunities,
      studentMentors: studentMentors,
    });
    //Displays raw data of all students and the view point of a logged in student
    // res.json({
    //   allStudents,
    //   allOpportunities,
    //   allMentors,
    //   student,
    //   studentOpportunities,
    //   studentMentors,
    // });
  }
};

exports.get_modify_participation = function (req, res) {
  res.render("ModifyParticipation", {
    page_title: "Contact Page",
    contact_info: "Contact Us via email @ hello@mentorcompass.com"
});
};



// Add participation of student in a mentoring opportunity into the designated database
exports.get_add_participation = async function (req, res) {
  try {
    // Check if student name is available in the session
    const studentName = req.session.student_name || "Guest";
    const studentEmail = req.session.email_address || "Guest";

    console.log(studentName)

    res.render("AddParticipation", {
      studentName: studentName,
      studentEmail: studentEmail,

    });
  } catch (error) {
    // Handle the error appropriately, e.g., log it or send an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



  // const category = req.body.category;
  // const title = req.body.title;
  // const name = req.body.name;
  // const email_address = req.body.email_address;
  // opportunitydb.insertParticipation(category, title, name, email_address);
  // res.redirect("/student/dashboard");
  //const authenticatedEmail = req.session.email_address; // Should work for authentication of email to verify if student is logged in or not
  //if (authenticatedEmail == null) {
  //res.redirect("/student/login");
  //} else {
  //opportunitydb.insertParticipation(category, title, name, email_address);
  //res.redirect("/student/dashboard");



exports.add_participation = function (req, res) {

  const category = req.body.category;
  const title = req.body.title;
  const name = req.body.name_to_be_addressed;
  const email_address = req.body.email_address;
  // opportunitydb.insertParticipation(category, title, name, email_address);
  // res.redirect("/student/dashboard");
  const authenticatedEmail = req.session.email_address; // Should work for authentication of email to verify if student is logged in or not
  if (authenticatedEmail == null) {
  res.redirect("/student/login");
  } else {
  opportunitydb.insertParticipation(category, title, name, email_address);
  res.redirect("/student/dashboard");
  // res.render("StudentDashboard", {
  //   studentName: studentName,
  // });
  }
};

// Modify participation of a mentoring opportunity
exports.modify_participation = function (req, res) {
  const id = req.params.id;
  const category = req.body.category;
  opportunitydb.updateParticipation(id, category);
  res.redirect("/student/dashboard");
  //const authenticatedEmail = req.session.email_address;
  //if (authenticatedEmail == null) {
  //res.redirect("/student/login");
  //} else {
  //opportunitydb.updateParticipation(id, category);
  //res.redirect("/student/dashboard");
  // }
};

// Delete participation from the database
exports.delete_participation = function (req, res) {
  const id = req.params.id;
  opportunitydb.deleteByID(id);
  res.redirect("/student/dashboard");
  //const email_address = req.body.email_address;
  //if (email_address == null) {
  //  res.redirect("/student/login");
  //} else {
  //  await opportunitydb.deleteByID(id);
  //  res.redirect("/student/dashboard");
  //}
};

// Logs out student; only functional if a student is logged in
exports.logout = function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error logging out:", err);
    } else {
      console.log("Logged Out");
      res.redirect("/student/login");
    }
  });
};
