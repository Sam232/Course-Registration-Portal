const routes = require("express").Router();
const axios = require("axios");

const {ensureAdminAuthentication, ensureLecturerAuthentication,
       ensureFinanceAuthentication, ensureStudentAuthentication} = require("../config/auth");

//Admin Signout
routes.get("/admin/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  if(token === req.user.token){
    var linkId = req.user.details.linkId;
    return axios.post("https://gtuccrrestapi.herokuapp.com/logout/", {}, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.message){
          req.logOut();
          req.flash("success_msg", response.data.message);
          return res.redirect(`/login/${linkId}`);
        }
      })
      .catch((err) => {
        var errorMsg = err.response.data.errorMsg;
        if(errorMsg == "Valid Token Required" || errorMsg == "Logout Unsuccessful"){
          req.flash("error_msg", "Unable To Logout, Try Again");
          return res.redirect(`/admin/welcome/${token}`);
        }
        req.logOut();
        req.flash("error_msg", errorMsg);
        res.redirect(`/login/${linkId}`);
      });
  }
  res.render("unAuthorized");
});

//Lecturer Signout
routes.get("/lecturer/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  if(token === req.user.token){
    var linkId = req.user.details.linkId;
    return axios.post("https://gtuccrrestapi.herokuapp.com/logout/", {}, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.message){
          req.logOut();
          req.flash("success_msg", response.data.message);
          return res.redirect(`/login/${linkId}`);
        }
      })
      .catch((err) => {
        var errorMsg = err.response.data.errorMsg;
        if(errorMsg == "Valid Token Required" || errorMsg == "Logout Unsuccessful"){
          req.flash("error_msg", "Unable To Logout, Try Again");
          return res.redirect(`/lecturer/welcome/${token}`);
        }
        req.logOut();
        req.flash("error_msg", errorMsg);
        res.redirect(`/login/${linkId}`);
      });
  }
  res.render("unAuthorized");
});

//Finance Signout
routes.get("/finance/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  if(token === req.user.token){
    var linkId = req.user.details.linkId;
    return axios.post("https://gtuccrrestapi.herokuapp.com/logout/", {}, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.message){
          req.logOut();
          req.flash("success_msg", response.data.message);
          return res.redirect(`/login/${linkId}`);
        }
      })
      .catch((err) => {
        var errorMsg = err.response.data.errorMsg;
        if(errorMsg == "Valid Token Required" || errorMsg == "Logout Unsuccessful"){
          req.flash("error_msg", "Unable To Logout, Try Again");
          return res.redirect(`/finance/welcome/${token}`);
        }
        req.logOut();
        req.flash("error_msg", errorMsg);
        res.redirect(`/login/${linkId}`);
      });
  }
  res.render("unAuthorized");
});

//Student Signout
routes.get("/student/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    req.logOut();
    req.flash("success_msg", "Logout Successful");
    return res.redirect("/login/");
  }
  res.render("unAuthorized");
});

module.exports = routes;