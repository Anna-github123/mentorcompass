// Import the Database instances from the db folder holding config.js and being inistialised in index.js
const { mentordb, admindb, opportunitydb, studentdb } = require("../db/config");
// Password encryption for authentication purposes
const bcrypt = require("bcrypt");


exports.mentorlogin = function (req, res) {
  res.render("MentorLogin", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};

exports.forgottenpassword = function (req, res) {
  res.render("ForgottenMentorPassword", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};


// Login function for mentors
exports.login = async function (req, res) {
  const password = req.body.password;
  const email_address = req.body.email_address;
  const mentor = await mentordb.findByEmail(email_address);
  if (mentor != null) {
    const valid_password = bcrypt.compareSync(password, mentor.hash_password);
    if (valid_password) {
      console.log("Mentor Found");
      req.session.role = "Mentor";
      req.session.email_address = mentor.email_address;
      res.redirect("/mentor/mentordashboard");
    } else {
      res.render("MentorLogin");
    }
  } else {
    res.redirect("/mentor/login");
  }
};

// Dashboard for mentors to enable them view their mentees or students under their coaching sessions
exports.dashboard = async function (req, res) {
  //const role = req.session.role;
  //const email_address = req.session.email_address;
  const role = "Mentor";
  const email_address = "s.martina@gmail.com";
  var mentorStudents = [];

  const mentor = await mentordb.findByEmail(email_address);

  var studentsMap = new Map();

  for (let i = 0; i < mentor.students.length; i++) {
    var studentOpportunities = [];
    const student = await studentdb.findByEmail(mentor.students[i]);
    studentOpportunities = await opportunitydb.findAllByEmail(
      mentor.students[i]
    );
    console.log(studentOpportunities);
    mentorStudents.push(student);
    studentsMap.set("a", 1);
    studentsMap.set(student.email_address, studentOpportunities);
  }

  if (role == "Mentor") {
    res.render("MentorDashboard", {mentor: mentor, studentsMap: studentsMap, mentorStudents: mentorStudents,});
    // res.json({
    //   mentor,
    //   studentsMap,
    //   mentorStudents,
    // });
  }
};




exports.mentordashboard = function (req, res) {
  res.render("MentorDashboard", {
      page_title: "Contact Page",
      contact_info: "Contact Us via email @ hello@mentorcompass.com"
  });
};
// Logs out student; only functional if a mentor is logged in
exports.logout = function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logged Out");
    } else {
      res.redirect("/mentor/login");
    }
  });
};
