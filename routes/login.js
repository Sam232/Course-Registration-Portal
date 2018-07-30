const routes = require("express").Router();
const passport = require("passport");
const axios = require("axios");

routes.get("/:linkId", (req, res) => {
  var linkId = req.params.linkId;

  axios.get(`https://gtuccrrestapi.herokuapp.com/login/verify/${linkId}`)
    .then((response) => {
      if(response.data.verifyState == "Correct LinkId"){
        res.locals.pageTitle = "Login";
        return res.render("login/alfLogin", {
          linkId
        });
      }
    })
    .catch((err) => {
      if(err){
        if(err.response.data.errorMsg){
          return res.render("errorOccured");
        }
        else{
          return res.render("notFound");
        }        
      }
      res.render("errorOccured");
    });
});

routes.get("/", (req, res) => {
  res.locals.pageTitle = "Login"
  res.render("login/studentLogin");
});

routes.get("/update/password", (req, res) => {
  res.locals.pageTitle = "Update Password";
  res.render("login/passwordUpdate");
});

routes.post("/student", (req, res, next) => {
  passport.authenticate("local-student", {
    successRedirect: "/student/welcome/",
    failureRedirect: "/login/",
    failureFlash: true
  })(req, res, next);
});

routes.post("/", (req, res, next) => {
  var linkId = req.body.password;
  passport.authenticate("local-user", {
    successRedirect: `/login/${linkId}`,
    failureRedirect: `/login/${linkId}`,
    successFlash: true,
    failureFlash: true
  })(req, res, next);
});

routes.post("/update/password", (req, res) => {
  var email = req.body.email;

  if(email){
    return axios.post("https://gtuccrrestapi.herokuapp.com/login/verify/student-email", {
      email
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Update Password";
          res.locals.success_ = response.data.msg;
          return res.render("login/passwordUpdate");
        }
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Update Password";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("login/passwordUpdate", {
            email
          });
        }
      });
  }
});

routes.get("/update/password/:token", (req, res) => {
  var token = req.params.token;

  axios.get("https://gtuccrrestapi.herokuapp.com/login/verify/page/token", {
    headers: {
      "Authorization": `bearer ${token}`
    }
  })
    .then((response) => {
      if(response.data.verifyState ){
        res.locals.pageTitle = "Update Password";
        return res.render("login/passwordUpdate2", {
          token
        });
      }
    })
    .catch((err) => {
      var errorMsg = err.response.data.errorMsg;
      if(errorMsg == "The Password Update Link Has Expired"){
        res.locals.error_msg_ = err.response.data.errorMsg+", Re-Enter Email Address";
        res.locals.pageTitle = "Update Page";
        return res.render("login/passwordUpdate");
      }
      if(errorMsg == "Valid Token Required" || errorMsg == "Token Is Required"){
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.locals.pageTitle = "Error Page";
        return res.render("notFound");
      }
    });
});

routes.post("/update/password/:token", (req, res) => {
  var loginDetails = {
    newPassword: req.body.newPassword,
    confirmPassword: req.body.confirmPassword
  };
  var token = req.params.token;

  if(loginDetails.newPassword.length < 8){
    res.locals.error_msg_ = "The Length of The New Password Must Be Greater Than 7";
    return res.render("login/passwordUpdate2", {
      token
    });
  }

  if(loginDetails.confirmPassword.length < 8){
    res.locals.error_msg_ = "The Length of The Confirm Password Must Be Greater Than 7";
    return res.render("login/passwordUpdate2", {
      token
    });
  }

  if(loginDetails.newPassword !== loginDetails.confirmPassword){
    res.locals.error_msg_ = "The New Password And Confirm Password Must Be The Same";
    return res.render("login/passwordUpdate2", {
      token
    });
  }

  if(!/[^a-zA-Z0-9]/.test(loginDetails.newPassword)){
    res.locals.error_msg_ = "Both Passwords Must Contain Alphabets And A Symbol. Numbers Can Be Included But It\'s Optional";
    return res.render("login/passwordUpdate2", {
      token
    });
  }

  axios.post("https://gtuccrrestapi.herokuapp.com/login/update/password", {
    password: loginDetails.newPassword
    }, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
    .then((response) => {
      if(response){
        res.locals.pageTitle = "Login";
        req.flash("success_msg", response.data.msg);
        return res.redirect("/login/");
      }
    })
    .catch((err) => {
      if(err){
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.locals.pageTitle = "Update Password";
        return res.render("login/passwordUpdate2", {
          token
        });
      }
    });
});


module.exports = routes;
