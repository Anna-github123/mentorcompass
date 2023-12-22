// Import all the important packages
const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mustache = require("mustache-express");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   httpOnly: true,
    //   sameSite: true,
    //   secure: true
    // }
  })
);

// Dat
const {mentordb,admindb,opportunitydb,studentdb}= require("./db/config");

studentdb.init();
opportunitydb.init();
mentordb.init();
admindb.init();

// Use
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.disable("x-powered-by"); // Security
app.engine("mustache", mustache());
app.set("view engine", "mustache");

// Import Routers to use
const homeRouter = require("./routes/HomeRoutes");
const studentRouter = require("./routes/StudentRoutes");
const mentorRouter = require("./routes/MentorRoutes");
const adminRouter = require("./routes/AdminRoutes");

app.use("/", homeRouter);
app.use("/student", studentRouter);
app.use("/mentor", mentorRouter);
app.use("/admin", adminRouter);

// To be displayed on terminal
app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
