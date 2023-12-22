const studentModel = require("../models/StudentModel");
const opportunityModel = require("../models/OpportunityModel");
const mentorModel = require("../models/MentorModel");
const adminModel = require("../models/AdminModel");

const opportunityDAO = new opportunityModel("./data/opportunity.db");
const studentDAO = new studentModel("./data/student.db");
const mentorDAO = new mentorModel("./data/mentor.db");
const adminDAO = new adminModel("./data/admin.db");



const DataStore={
 studentdb: studentDAO,
opportunitydb: opportunityDAO,
mentordb:  mentorDAO,
 admindb:adminDAO,
}


module.exports = DataStore;

