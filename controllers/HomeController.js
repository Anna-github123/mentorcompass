// Import the Database instances from the db folder holding config.js and being inistialised in index.js
const {mentordb,admindb,opportunitydb,studentdb}= require("../db/config");

// Home display
exports.home = function (req, res) {
    res.render("Home", {
        page_title: "Home Page",
        name: "John Anna" 
    });
};

// About display
exports.about = function (req, res) {
    res.render("About", {
        page_title: "About Page",
        description: "MentorCompass provides mentoring solution for Students." 
    });
};

// Contact display
exports.contact = function (req, res) {
    res.render("Contact", {
        page_title: "Contact Page",
        contact_info: "Contact Us via email @ hello@mentorcompass.com"
    });
};



// Error display
exports.error = function (req, res) {
    res.render("PageNotFound", {
        errorTitle: "Status 404"
    });
};

// Internal server error display
exports.server_error = function (req, res) {
    res.render("InternalServerError", {
        errorTitle: "Status 500"
    });
};
