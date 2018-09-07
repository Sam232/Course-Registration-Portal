const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const json2xls = require("json2xls");

const login = require("./routes/login");
const logout = require("./routes/logout");
const admin = require("./routes/admin");
const lecturer = require("./routes/lecturer");
const finance = require("./routes/finance");
const student = require("./routes/student");

var app = express();

//Passport Config
require("./config/passport").passport(passport);

//Helper
const {showFullName, showYear} = require("./helper/user");

//Express Handlebars Middleware
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    showFullName,
    showYear
  }
}));
app.set("view engine", "handlebars");
//app.enable("view cache");

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Express Session Middleware
app.use(session({
  secret: "crsecretKey",
  saveUninitialized: true,
  resave: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash Middleware
app.use(flash());

//Method Override Middleware
app.use(methodOverride("_method"));

//Json2xls Middleware
app.use(json2xls.middleware);

//Global Variables
app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg_ = null;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.success_ = null;
  res.locals.user = req.user;
  res.locals.pageTitle = null;
  res.locals.courseRDState = null;
  res.locals.registerCourseError = null;
  next();
});

//Static Folder
app.use(express.static(path.join(__dirname, "/public")));

//Handling App Routes
app.use("/login", login);
app.use("/admin", admin);
app.use("/lecturer", lecturer);
app.use("/finance", finance);
app.use("/student", student);
app.use("/logout", logout);

app.use((req, res, next) => {
  res.render("notFound");
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Is Running On PORT ${PORT}`)
});
