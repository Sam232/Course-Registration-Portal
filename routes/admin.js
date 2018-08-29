const routes = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const readExcelFile = require("read-excel-file/node");
const validator = require("email-validator");
const fs = require("fs");
const path = require("path");

const {ensureAdminAuthentication} = require("../config/auth");

//Admin Welcome Page
routes.get("/welcome/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/welcome", {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "WELCOME";
          return res.render("admin/welcome", {
            usersNumber: response.data.usersNumber,
            token: req.user.token
          });
        }
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "WELCOME";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("admin/welcome", {
            usersNumber: response.data.usersNumber,
            token: req.user.token
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Lecturers
routes.get("/view/lecturers/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/lecturers", {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.lecturers.length > 0){
          res.locals.pageTitle = "Lecturers";
          return res.render("admin/view/lecturers", {
            queryResult: response.data.lecturers
          });
        }
        res.locals.pageTitle = "Lecturers";
        res.locals.error_msg_ = err.response.data.message;
        res.render("admin/view/lecturers", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Financial Accountants";
          res.locals.error_msg_ = err.response.data.errMsg;
          res.render("admin/view/lecturers", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Financial Accountants
routes.get("/view/finance/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/finance", {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Financial Accountants";
          return res.render("admin/view/finance", {
            queryResult: response.data.finance
          });
        }
        res.locals.pageTitle = "Financial Accountants";
        res.locals.error_msg_ = err.response.data.message;
        res.render("admin/view/finance", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Financial Accountants";
          res.locals.error_msg_ = err.response.data.errMsg;
          res.render("admin/view/finance", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Students
routes.get("/view/students/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/students", {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.students.length > 0){
          res.locals.pageTitle = "Students";
          return res.render("admin/view/student", {
            queryResult: response.data.students
          });
        }
        res.locals.pageTitle = "Students";
        res.locals.error_msg_ = err.response.data.message;
        res.render("admin/view/student", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Students";
          res.locals.error_msg_ = err.response.data.errMsg;
          res.render("admin/view/student", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Adding Financial Accountant
routes.get("/add/finance/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    res.locals.pageTitle = "Add Financial Account";
    return res.render("admin/add/newFinance");
  }
  res.render("unAuthorized");
});

//Render Page For Adding Lecturer
routes.get("/add/lecturer/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    res.locals.pageTitle = "Add Lecturer";
    return res.render("admin/add/newLecturer");
  }
  res.render("unAuthorized");
});

//Render Page For Adding Student
routes.get("/add/student/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    res.locals.pageTitle = "Add Student";
    return res.render("admin/add/newStudent");
  }
  res.render("unAuthorized");
});

//Add New Financial Accountant
routes.post("/add/finance/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    var financeDetails = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    };

  return axios.post("https://gtuccrrestapi.herokuapp.com/admin/add/finance", {
      firstName: financeDetails.firstName,
      lastName: financeDetails.lastName,
      email: financeDetails.email,
      mobileNumber: financeDetails.mobileNumber
    }, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.emailSent){
          res.locals.pageTitle = "Add Financial Accountant";
          req.flash("success_msg", "New Financial Accountant Added");
          return res.redirect(`/admin/add/finance/${token}`);
        }          
      })
      .catch((err) => {
        if(err.response){
          if(err.response.data.errorMsg){
            res.locals.pageTitle = "Add Financial Accountant";
            res.locals.error_msg_ = err.response.data.errorMsg;
            return res.render("admin/add/newFinance", {
              firstName: financeDetails.firstName,
              lastName: financeDetails.lastName,
              email: financeDetails.email,
              mobileNumber: financeDetails.mobileNumber
            });
          }
          res.locals.pageTitle = "Add Financial Accountant";
          req.flash("success_msg", "New Financial Accountant Added But Email Wasn\'t Sent To The User.");
          res.redirect(`/admin/add/finance/${token}`);
          
        }
      });   
  }
  res.render("unAuthorized");
});

//Add New Lecturer
routes.post("/add/lecturer/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    var lecturerDetails = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    };

  return axios.post("https://gtuccrrestapi.herokuapp.com/admin/add/lecturer", {
      firstName: lecturerDetails.firstName,
      lastName: lecturerDetails.lastName,
      email: lecturerDetails.email,
      mobileNumber: lecturerDetails.mobileNumber
    }, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.emailSent){
          res.locals.pageTitle = "Add Lecturer";
          req.flash("success_msg", "New Lecturer Added");
          return res.redirect(`/admin/add/lecturer/${token}`);
        }
        req.flash("success_msg", "New Lecturer Added But Email Wasn\'t Sent To The User.");
        res.redirect(`/admin/add/lecturer/${token}`);
      })
      .catch((err) => {
        if(err.response){
          if(err.response.data.errorMsg){
            res.locals.pageTitle = "Add Lecturer";
            res.locals.error_msg_ = err.response.data.errorMsg;
            return res.render("admin/add/newLecturer", {
              firstName: lecturerDetails.firstName,
              lastName: lecturerDetails.lastName,
              email: lecturerDetails.email,
              mobileNumber: lecturerDetails.mobileNumber
            });            
          }
          res.locals.pageTitle = "Add Lecturer";
          req.flash("success_msg", "New Lecturer Added But Email Wasn\'t Sent To The User.");
          res.redirect(`/admin/add/lecturer/${token}`);          
        }
      });   
  }
  res.render("unAuthorized");
});

//Add New Student
routes.post("/add/student/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    var studentDetails = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      indexNumber: req.body.indexNumber,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    };

  return axios.post("https://gtuccrrestapi.herokuapp.com/admin/add/student", {
      firstName: studentDetails.firstName,
      lastName: studentDetails.lastName,
      indexNumber: studentDetails.indexNumber,
      email: studentDetails.email,
      mobileNumber: studentDetails.mobileNumber
    }, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.emailSent){
          res.locals.pageTitle = "Add Student";
          req.flash("success_msg", "New Student Added");
          return res.redirect(`/admin/add/student/${token}`);
        }
        res.locals.pageTitle = "Add Student";
        req.flash("success_msg", "New Student Added But Email Wasn\'t Sent To The User.");
        res.redirect(`/admin/add/student/${token}`);
      })
      .catch((err) => {
        if(err.response){
          if(err.response.data.errorMsg){
            res.locals.pageTitle = "Add Student";
            res.locals.error_msg_ = err.response.data.errorMsg;
            return res.render("admin/add/newStudent", {
              firstName: studentDetails.firstName,
              lastName: studentDetails.lastName,
              indexNumber: studentDetails.indexNumber,
              email: studentDetails.email,
              mobileNumber: studentDetails.mobileNumber
            });
          }
          res.locals.pageTitle = "Add Student";
          req.flash("success_msg", "New Student Added But Email Wasn\'t Sent To The User.");
          res.redirect(`/admin/add/student/${token}`);
        }
      });   
  }
  res.render("unAuthorized");
});

//Add Two Or More Students Personal Details Contained In An Excel File
routes.post("/add/students/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    var excelFile;

    var upload = multer({
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          callback(null, "./public/");
        },
        filename: (req, file, callback) => {
          excelFile = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
          callback(null, excelFile);
        }
      }),
      fileFilter: (req, file, callback) => {
        var extname = path.extname(file.originalname);
        
        if(extname === ".xlsx"){
          return callback(null, true);
        }
        callback(new Error("A Valid SpreadSheet File With .xlsx Extension Should Be Uploaded"));
      }
    }).single("studentsFile");

    return upload(req, res, (err) => {
      if(err){
        res.locals.pageTitle = "Add Student";
        req.flash("error_msg", "A Valid SpreadSheet File With .xlsx Extension Should Be Uploaded");
        return res.redirect(`/admin/add/student/${token}`);
      }
 
      readExcelFile(`./public/${excelFile}`).then((rows) => {
        if(rows.length > 0){
          return rows.forEach((personalDetails, index) => {
            if(personalDetails && index > 0){
              var studentDetails = {
                firstName: personalDetails[0],
                lastName: personalDetails[1],
                indexNumber: personalDetails[4],
                email: personalDetails[2],
                mobileNumber: personalDetails[3].toString()
              };
              axios.post("https://gtuccrrestapi.herokuapp.com/admin/add/student", {
                firstName: studentDetails.firstName,
                lastName: studentDetails.lastName,
                indexNumber: studentDetails.indexNumber,
                email: studentDetails.email,
                mobileNumber: studentDetails.mobileNumber
              }, {
                headers: {
                  "Authorization": `bearer ${token}`
                }
              })
                .then((response) => {
                  if(response.data){
                    if(rows.length == index+1){
                      return fs.unlink(`./public/${excelFile}`, (err) => {
                        if(err){
                          req.flash("error_msg", "An Error Occured While Adding The Students Details Contained In The Excel File, Try Again");
                          res.redirect(`/admin/add/student/${token}`);
                        }
                        else{
                          req.flash("success_msg", "New Students Details Added");
                          res.redirect(`/admin/add/student/${token}`);
                        }
                      });
                    }
                    index++;
                  }
                })
                .catch((err) => {
                  if(err.response){
                    console.log(err.response.data.errorMsg)
                    req.flash("error_msg", err.response.data.errorMsg);
                    res.redirect(`/admin/add/student/${token}`);
                  }
                });   
            }
          });
        }
        req.flash("error_msg", "No Personal Details Of Students Are Contained In The Excel File");
        res.redirect(`/admin/add/student/${token}`);
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Add Student";
          req.flash("error_msg", err);
          res.redirect(`/admin/add/student/${token}`);
        }
      });
    });
  }
  res.render("unAuthorized");
});

//Add New Registration Dates
routes.post("/add/registration-dates/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    var registrationDetails = {
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };

    return axios.post("https://gtuccrrestapi.herokuapp.com/admin/add/registration-dates", registrationDetails, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.addState == "successful"){
          res.locals.pageTitle = "Add Registration Dates";
          res.locals.success_msg_ = "New Registration Dates Added";
          return res.render("admin/add/newRegistrationDates", {
            queryResult: response.data.rdates
          });
        }
      })
      .catch((err) => {
        if(err.response){
          if(err.response.data){
            res.locals.pageTitle = "Add Registration Dates";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.render("admin/add/newRegistrationDates");
          }
          else{
            res.locals.pageTitle = "Add Registration Dates";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.render("admin/add/newRegistrationDates", {
              startDate: registrationDetails.startDate,
              endDate: registrationDetails.endDate
            });
          }
        }
      });   
  }
  res.render("unAuthorized");
});

//Fetch Registration Date And Render On A Page
routes.get("/view/registration-date/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/registration-date", {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          res.locals.pageTitle = "Add Registration Dates";
          return res.render("admin/add/newRegistrationDates", {
            queryResult: response.data.rdates
          });
        }
        res.locals.pageTitle = "Add Registration Dates";
        res.render("admin/add/newRegistrationDates");
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Add Registration Dates";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("admin/add/RegistrationDates");
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Financial Accountants To Be Updated
routes.get("/update/finance/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/finance", {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.finance.length > 0){
          res.locals.pageTitle = "Financial Accountants";
          return res.render("admin/update/finance", {
            queryResult: response.data.finance
          });
        }
        res.locals.pageTitle = "Financial Accountants";
        res.locals.error_msg_ = response.data.message;
        res.render("admin/update/finance", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Financial Accountants";
          res.locals.error_msg_ = err.response.data.errMsg;
          res.render("admin/update/finance", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Lecturers To Be Updated
routes.get("/update/lecturer/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/lecturers", {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.lecturers.length > 0){
          res.locals.pageTitle = "Lecturers";
          return res.render("admin/update/lecturer", {
            queryResult: response.data.lecturers
          });
        }
        res.locals.pageTitle = "Lecturers";
        res.locals.error_msg_ = response.data.message
        res.render("admin/update/lecturer", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Lecturers";
          res.locals.error_msg_ = response.data.errMsg
          res.render("admin/update/lecturer", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Students To Be Updated
routes.get("/update/student/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/students", {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.students.length){
          res.locals.pageTitle = "Students";
          return res.render("admin/update/student", {
            queryResult: response.data.students
          });
        }
        res.locals.pageTitle = "Students";
        res.locals.error_msg_ = response.data.message
        res.render("admin/update/student", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Students";
          res.locals.error_msg_ = response.data.errMsg
          res.render("admin/update/lecturer", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Updating Student Login Details
routes.get("/update/selected-student-login/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token; 
  var id = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/single/student/${id}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.personalDetails){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Update Student Login";
          return res.render("admin/update/updateStudentLogin", {
            indexNumber: result.indexNumber
          });
        }
        res.locals.pageTitle = "Students";
        req.flash("error_msg", "No Student's ID Matches The Provided ID");
        res.redirect(`/admin/update/student/${token}`);
      })
      .catch((err) => {
        if(err){
          if(err.response.data.errorMsg){
            res.locals.pageTitle = "Students";
            req.flash("error_msg", err.response.data.errorMsg);
            res.redirect(`/admin/update/student/${token}`);
          }
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Selected Financial Accountant
routes.get("/update/selected-finance/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var financeId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/single/finance/${financeId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Update Financial Accountant";
          return res.render("admin/update/updateSingleFinance", {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            mobileNumber: "0"+result.mobileNumber
          });
        }
      })
      .catch((err) => {
        if(err){
          if(err.response.data){
            res.locals.pageTitle = "Financial Accountants";
            req.flash("error_msg", err.response.data.errorMsg);
            res.redirect(`/admin/update/finance/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Selected Lecturer
routes.get("/update/selected-lecturer/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/single/lecturer/${lecturerId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Update Lecturer";
          return res.render("admin/update/updateSingleLecturer", {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            mobileNumber: "0"+result.mobileNumber
          });
        }
      })
      .catch((err) => {
        if(err){
          if(err.response.data){
            res.locals.pageTitle = "Lecturers";
            req.flash("error_msg", err.response.data.errorMsg);
            res.redirect(`/admin/update/lecturer/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Selected Student
routes.get("/update/selected-student/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var studentId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/single/student/${studentId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Update Student";
          return res.render("admin/update/updateSingleStudent", {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            indexNumber: result.indexNumber,
            email: result.email,
            mobileNumber: "0"+result.mobileNumber
          });
        }
      })
      .catch((err) => {
        if(err){
          if(err.response.data){
            res.locals.pageTitle = "Students";
            req.flash("error_msg", err.response.data.errorMsg);
            res.redirect(`/admin/update/student/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Confirm Update To Financial Accountant's Personal Details
routes.post("/confirm-update/finance/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var financeId = req.params.id;

  if(token === req.user.token){
    var updateDetails = {
      id: financeId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    }

    return jwt.sign({updateDetails}, "secretKey", {expiresIn: "300000"}, (err, token) => {
      if(err){
        res.locals.pageTitle = "Financial Accountant\'s Profile";
        res.locals.error_msg_ = "An Error Occured, Try Again";
        return res.render("admin/update/updateAdminProfile", {
          _id: updateDetails.id,
          firstName: updateDetails.firstName,
          lastName: updateDetails.lastName,
          email: updateDetails.email,
          mobileNumber: updateDetails.mobileNumber
        });
      }

      var adminDetails = req.user.details;
      var emailDetails = {
        adminFirstName: adminDetails.firstName,
        financeFirstName: updateDetails.firstName,
        adminEmail: adminDetails.email,
        loginToken: req.user.token,
        token
      };

      axios.post("https://gtuccrrestapi.herokuapp.com/admin/confirm-update/finance", emailDetails, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.emailSent){
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.success_msg_ = "A Confirm Update Link Has Been Sent To Your Email. Click On The Link To Complete The Update";
            return res.render("admin/update/updateSingleFinance", {
              _id: updateDetails.id,
              firstName: updateDetails.firstName,
              lastName: updateDetails.lastName,
              email: updateDetails.email,
              mobileNumber: updateDetails.mobileNumber
            });
          }
        })
        .catch((err) => {
          if(!err.response.data.emailSent){
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.error_msg_ = "An Error Occured, Try Again";
            return res.render("admin/update/updateSingleFinance", {
              _id: updateDetails.id,
              firstName: updateDetails.firstName,
              lastName: updateDetails.lastName,
              email: updateDetails.email,
              mobileNumber: updateDetails.mobileNumber
            });
          }
          res.render("notFound");
        });
    });   
  }
  res.render("unAuthorized");
});

//Update Financial Accountant's Personal Details
routes.get("/confirm-update/finance/:loginToken/:token", ensureAdminAuthentication, (req, res) => {
  var loginToken = req.params.loginToken;
  var token = req.params.token;

  if(loginToken === req.user.token){
    return jwt.verify(token, "secretKey", (err, authData) => {
      if(err){
        if(err.name == "TokenExpiredError"){
          res.locals.pageTitle = "Financial Accountants";
          req.flash("error_msg", "Update Link Expired, Re-Update The Profile");
          return res.redirect(`/admin/update/finance/${loginToken}`);
        }
        if(err.message == "invalid token"){
          return res.render("unAuthorized");
        }
        if(err.message == "jwt malformed"){
          return res.render("unAuthorized");
        }
      }
      
      var updateDetails = authData.updateDetails;
      axios.put(`https://gtuccrrestapi.herokuapp.com/admin/update/finance/${updateDetails.id}`, updateDetails, {
        headers: {
          "Authorization": `bearer ${loginToken}`
        }
      })
        .then((response) => {
          if(response.data.updatedDetails){
            var FinancePD = response.data.updatedDetails;
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.success_msg_ = "Update Successful";
            return res.render("admin/update/updateSingleFinance", {
              _id: FinancePD._id,
              firstName: FinancePD.firstName,
              lastName: FinancePD.lastName,
              email: FinancePD.email,
              mobileNumber: "0"+FinancePD.mobileNumber
            });
          }
        })
        .catch((err) => {
          if(err.response){
            var financePD = err.response.data.financeDetails;
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.error_msg_ = err.response.data.errorMsg;
            return res.render("admin/update/updateSingleFinance", {
              _id: financePD.id,
              firstName: financePD.firstName,
              lastName: financePD.lastName,
              email: financePD.email,
              mobileNumber: financePD.mobileNumber
            });
          }
        });
    });
  }
  res.render("unAuthorized");
});

//Confirm Update To Lecturer's Personal Details
routes.post("/confirm-update/lecturer/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.params.id;
  
  if(token === req.user.token){
    var updateDetails = {
      id: lecturerId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    };

    return jwt.sign({updateDetails}, "secretKey", {expiresIn: "300000"}, (err, token) => {
      if(err){
        res.locals.pageTitle = "Lecturer\'s Profile";
        res.locals.error_msg_ = "An Error Occured, Try Again";
        return res.render("admin/update/updateAdminProfile", {
          _id: updateDetails.id,
          firstName: updateDetails.firstName,
          lastName: updateDetails.lastName,
          email: updateDetails.email,
          mobileNumber: updateDetails.mobileNumber
        });
      }

      var adminDetails = req.user.details;
      var emailDetails = {
        adminFirstName: adminDetails.firstName,
        lecturerFirstName: updateDetails.firstName,
        adminEmail: adminDetails.email,
        loginToken: req.user.token,
        token
      };

      axios.post("https://gtuccrrestapi.herokuapp.com/admin/confirm-update/lecturer", emailDetails, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.emailSent){
            res.locals.pageTitle = "Lecturer\'s Profile";
            res.locals.success_msg_ = "A Confirm Update Link Has Been Sent To Your Email. Click On The Link To Complete The Update";
            return res.render("admin/update/updateSingleLecturer", {
              _id: updateDetails.id,
              firstName: updateDetails.firstName,
              lastName: updateDetails.lastName,
              email: updateDetails.email,
              mobileNumber: updateDetails.mobileNumber
            });
          }
        })
        .catch((err) => {
          if(!err.response.data.emailSent){
            res.locals.pageTitle = "Lecturer\'s Profile";
            res.locals.error_msg_ = "An Error Occured, Try Again";
            return res.render("admin/update/updateSingleLecturer", {
              _id: updateDetails.id,
              firstName: updateDetails.firstName,
              lastName: updateDetails.lastName,
              email: updateDetails.email,
              mobileNumber: updateDetails.mobileNumber
            });
          }
          res.render("notFound");
        });
    });   
  }
  res.render("unAuthorized");
});

//Update Lecturer's Personal Details
routes.get("/confirm-update/lecturer/:loginToken/:token", ensureAdminAuthentication, (req, res) => {
  var loginToken = req.params.loginToken;
  var token = req.params.token;

  if(loginToken === req.user.token){
    return jwt.verify(token, "secretKey", (err, authData) => {
      if(err){
        if(err.name == "TokenExpiredError"){
          res.locals.pageTitle = "Lecturers";
          req.flash("error_msg", "Update Link Expired, Re-Update The Profile");
          return res.redirect(`/admin/update/lecturer/${loginToken}`);
        }
        if(err.message == "invalid token"){
          return res.render("unAuthorized");
        }
        if(err.message == "jwt malformed"){
          return res.render("unAuthorized");
        }
      }
      
      var updateDetails = authData.updateDetails;
      axios.put(`https://gtuccrrestapi.herokuapp.com/admin/update/lecturer/${updateDetails.id}`, updateDetails, {
        headers: {
          "Authorization": `bearer ${loginToken}`
        }
      })
        .then((response) => {
          if(response.data.updatedDetails){
            var LecturerPD = response.data.updatedDetails;
            res.locals.pageTitle = "Lecturer\'s Profile";
            res.locals.success_msg_ = "Update Successful";
            return res.render("admin/update/updateSingleLecturer", {
              _id: LecturerPD._id,
              firstName: LecturerPD.firstName,
              lastName: LecturerPD.lastName,
              email: LecturerPD.email,
              mobileNumber: "0"+LecturerPD.mobileNumber
            });
          }
        })
        .catch((err) => {
          if(err.response){
            var lecturerPD = err.response.data.lecturerDetails;
            res.locals.pageTitle = "Lecturer\'s Profile";
            res.locals.error_msg_ = err.response.data.errorMsg;
            return res.render("admin/update/updateSingleLecturer", {
              _id: lecturerPD.id,
              firstName: lecturerPD.firstName,
              lastName: lecturerPD.lastName,
              email: lecturerPD.email,
              mobileNumber: lecturerPD.mobileNumber
            });
          }
        });
    });
  }
  res.render("unAuthorized");
});

//Update Student's Details
routes.put("/update/selected-student/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var studentId = req.params.id;
  
  if(token === req.user.token){
    var studentDetails = {
      _id: studentId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      indexNumber: req.body.indexNumber,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    }

    return axios.put(`https://gtuccrrestapi.herokuapp.com/admin/update/student/${studentDetails._id}`, {
      firstName: studentDetails.firstName,
      lastName: studentDetails.lastName,
      indexNumber: studentDetails.indexNumber,
      email: studentDetails.email,
      mobileNumber: studentDetails.mobileNumber
    },{
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          res.locals.pageTitle = "Update Student";
          res.locals.success_msg_ = "Update Successful";
          return res.render("admin/update/updateSingleStudent", {
            _id: studentDetails._id,
            firstName: studentDetails.firstName,
            lastName: studentDetails.lastName,
            indexNumber: studentDetails.indexNumber,
            email: studentDetails.email,
            mobileNumber: studentDetails.mobileNumber
          }); 
        }
        res.locals.pageTitle = "Update Student";
        res.locals.error_msg_ = "Update unsuccessful, Try Again";
        res.render("admin/update/updateSingleStudent", {
          _id: studentDetails._id,
          firstName: studentDetails.firstName,
          lastName: studentDetails.lastName,
          indexNumber: studentDetails.indexNumber,
          email: studentDetails.email,
          mobileNumber: studentDetails.mobileNumber
        }); 
      })
      .catch((err) => {
        if(err){
          var result = err.response;
          if(result.data.errorMsg == "Invalid Student ID Provided" || result.data.errorMsg == "Unable To Fetch The Documents Containing The Student\'s PD"){
            res.locals.pageTitle = "Update Student";
            res.locals.error_msg_ = result.data.errorMsg;
            return res.redirect(`/admin/update/student/${token}`);
          }
          res.locals.pageTitle = "Update Student";
          res.locals.error_msg_ = result.data.errorMsg;
          res.render("admin/update/updateSingleStudent", {
            _id: studentDetails._id,
            firstName: studentDetails.firstName,
            lastName: studentDetails.lastName,
            indexNumber: studentDetails.indexNumber,
            email: studentDetails.email,
            mobileNumber: studentDetails.mobileNumber
          });           
        }
      });  
  }
  res.render("unAuthorized");
});

//Update Student's Login Details
routes.put("/update/selected-student-login/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    var loginDetails = {
      indexNumber: req.body.indexNumber,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword
    }

    return axios.put("https://gtuccrrestapi.herokuapp.com/admin/update/student-login", loginDetails ,{
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          res.locals.pageTitle = "Update Student";
          res.locals.success_msg_ = "Update Successful";
          return res.render("admin/update/updateStudentLogin", {
            indexNumber: loginDetails.indexNumber
          }); 
        }
        res.locals.pageTitle = "Update Student";
        res.locals.error_msg_ = "Update unsuccessful, Try Again";
        res.render("admin/update/updateStudentLogin", {
          indexNumber: loginDetails.indexNumber
        }); 
      })
      .catch((err) => {
        if(err){
          var result = err.response;
          if(result.data){
            res.locals.pageTitle = "Update Student";
            res.locals.error_msg_ = result.data.errorMsg;
            return res.render("admin/update/updateStudentLogin", {
              indexNumber: req.body.indexNumber
            });
          }
          res.locals.pageTitle = "Update Student";
          res.locals.error_msg_ = result.data.errorMsg;
          res.render("admin/update/updateStudentLogin", {
            indexNumber: req.body.indexNumber
          });           
        }
      });  
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Financial Accountants To Be Deleted
routes.get("/delete/finance/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/finance", {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.finance.length > 0){
          res.locals.pageTitle = "Financial Accountants";
          return res.render("admin/delete/finance", {
            queryResult: response.data.finance
          });
        }
        res.locals.pageTitle = "Financial Accountants";
        res.locals.error_msg_ = response.data.message
        res.render("admin/delete/finance", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Financial Accountants";
          res.locals.error_msg_ = err.response.data.errMsg
          res.render("admin/delete/finance", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Lecturers To Be Deleted
routes.get("/delete/lecturer/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/lecturers", {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.lecturers.length > 0){
          res.locals.pageTitle = "Lecturers";
          return res.render("admin/delete/lecturer", {
            queryResult: response.data.lecturers
          });
        }
        res.locals.pageTitle = "Lecturers";
        res.locals.error_msg_ = response.data.message
        res.render("admin/delete/lecturer", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Lecturers";
          res.locals.error_msg_ = err.response.data.errMsg
          res.render("admin/delete/lecturer", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Students To Be Deleted
routes.get("/delete/student/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get("https://gtuccrrestapi.herokuapp.com/admin/view/students", {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.students.length > 0){
          res.locals.pageTitle = "Students";
          return res.render("admin/delete/student", {
            queryResult: response.data.students
          });
        }
        
        res.locals.pageTitle = "Students";
        res.locals.error_msg_ = response.data.message;
        res.render("admin/delete/student", {
          queryResult: []
        });
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Students";
          res.locals.error_msg_ = err.response.data.errMsg;
          res.render("admin/delete/student", {
            queryResult: []
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Delete Student's Personal Details And Login Details
routes.delete("/delete/selected-student/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var studentId = req.params.id;

  if(token === req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/admin/delete/student/${studentId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Students";
          req.flash("success_msg", "Delete Successful");
          return res.redirect(`/admin/delete/student/${token}`);
        }
      })
      .catch((err) => {
        if(err.response){
          res.locals.pageTitle = "Students";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/admin/delete/student/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Delete Lecturer's Personal Details
routes.delete("/delete/selected-lecturer/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.params.id;

  if(token === req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/admin/delete/lecturer/${lecturerId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Lecturers";
          req.flash("success_msg", "Delete Successful" || response.data.msg);
          return res.redirect(`/admin/delete/lecturer/${token}`);
        }
      })
      .catch((err) => {
        if(err.response){
          res.locals.pageTitle = "Lecturers";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/admin/delete/lecturer/${token}`);
        }
      }); 
  }
  res.render("unAuthorized");
});

//Delete Finance's Personal Details
routes.delete("/delete/selected-finance/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var financeId = req.params.id;

  if(token === req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/admin/delete/finance/${financeId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Finance";
          req.flash("success_msg", "Delete Successful" || response.data.msg);
          return res.redirect(`/admin/delete/finance/${token}`);
        }
      })
      .catch((err) => {
        if(err.response){
          res.locals.pageTitle = "Finances";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/admin/delete/finance/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//View Courses Added By A Lecturer
routes.get("/view/lecturer-courses/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/course/${lecturerId}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.courses.length > 0){
          res.locals.pageTitle = "Lecturer\'s Courses";
          return res.render("admin/view/courses", {
            courses: response.data.courses
          });
        }
        res.locals.pageTitle = "Lecturer\'s Courses";
        res.locals.error_msg_ = "No Course(s) Added";
        res.render("admin/view/courses", {
          courses: response.data.courses
        });
      })
      .catch((err) => {
        if(err){
          if(err.response.data.errorMsg){
            res.locals.pageTitle = "Lecturer\'s Courses";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.redirect(`/admin/view/lecturers/${token}`);
          }
        }
      });
  }
  res.render("unAuthorized");
});

//View Payments Enabled By A Financial Accountant
routes.get("/view/student-payments/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var financeId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/payments/${financeId}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.payments.length > 0){
          res.locals.pageTitle = "Student\'s Payment";
          return res.render("admin/view/payments", {
            payments: response.data.payments
          });
        }
        res.locals.pageTitle = "Student\'s Payment";
        res.locals.error_msg_ = response.data.msg;
        res.render("admin/view/payments", {
          payments: response.data.payments
        });
      })
      .catch((err) => {
        if(err){
          if(err.response.data.errorMsg){
            res.locals.pageTitle = "Student\'s Payment";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.redirect(`admin/view/finance/${token}`);
          }
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Admin's Personal Details
routes.get("/admin-login-details/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var adminId = req.user.details._id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/admin/${adminId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Admin\'s Profile";
          return res.render("admin/update/updateAdminProfile", {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            mobileNumber: "0"+result.mobileNumber
          });
        }
      })
      .catch((err) => {
        if(err){
          if(err.response.data.errorMsg == "Unable To Fetch Admin\'s Personal Details"){
            res.locals.pageTitle = "Lecturers";
            req.flash("error_msg", "Unable To Fetch Your Personal Details, Try Again");
            res.redirect(`/lecturer/welcome/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Confirm Update To Admin's Personal Details
routes.post("/confirm-update/:id/:token", ensureAdminAuthentication, (req, res) => {
  var token = req.params.token;
  var adminId = req.params.id;
  
  if(token === req.user.token){
    var updateDetails = {
      id: adminId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    }

    return jwt.sign({updateDetails}, "secretKey", {expiresIn: "300000"}, (err, token) => {
      if(err){
        res.locals.pageTitle = "Admin Profile";
        res.locals.error_msg_ = "An Error Occured, Try Again";
        return res.render("admin/update/updateAdminProfile", {
          _id: updateDetails.id,
          firstName: updateDetails.firstName,
          lastName: updateDetails.lastName,
          email: updateDetails.email,
          mobileNumber: updateDetails.mobileNumber
        });
      }

      var adminDetails = req.user.details;
      var emailDetails = {
        firstName: adminDetails.firstName,
        adminEmail: adminDetails.email,
        loginToken: req.user.token,
        token
      };

      axios.post("https://gtuccrrestapi.herokuapp.com/admin/confirm-update", emailDetails, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.emailSent){
            res.locals.pageTitle = "Admin Profile";
            res.locals.success_msg_ = "A Confirm Update Link Has Been Sent To Your Email. Click On The Link To Complete The Update";
            return res.render("admin/update/updateAdminProfile", {
              _id: updateDetails.id,
              firstName: updateDetails.firstName,
              lastName: updateDetails.lastName,
              email: updateDetails.email,
              mobileNumber: updateDetails.mobileNumber
            });
          }
        })
        .catch((err) => {
          if(!err.response.data.emailSent){
            res.locals.pageTitle = "Admin Profile";
            res.locals.error_msg_ = "An Error Occured, Try Again";
            res.render("admin/update/updateAdminProfile", {
              _id: updateDetails.id,
              firstName: updateDetails.firstName,
              lastName: updateDetails.lastName,
              email: updateDetails.email,
              mobileNumber: updateDetails.mobileNumber
            });
          }
          res.render("notFound");
        });
    });   
  }
  res.render("unAuthorized");
});

//Update Admin's Personal Details
routes.get("/confirm-update/:loginToken/:token", ensureAdminAuthentication, (req, res) => {
  var loginToken = req.params.loginToken;
  var token = req.params.token;

  if(loginToken === req.user.token){
    return jwt.verify(token, "secretKey", (err, authData) => {
      if(err){
        if(err.name == "TokenExpiredError"){
          res.locals.pageTitle = "Admin Profile";
          res.locals.error_msg_ = "Update Link Expired, Re-Update Your Profile";
          return res.render("admin/update/updateAdminProfile", {
            _id: req.user.details._id,
            firstName: req.user.details.firstName,
            lastName: req.user.details.lastName,
            email: req.user.details.email,
            mobileNumber: "0"+req.user.details.mobileNumber
          });
        }
        if(err.message == "invalid token"){
          return res.render("unAuthorized");
        }
        if(err.message == "jwt malformed"){
          return res.render("unAuthorized");
        }
      }
      
      var updateDetails = authData.updateDetails;
      axios.put(`https://gtuccrrestapi.herokuapp.com/admin/update/admin/${updateDetails.id}`, updateDetails, {
        headers: {
          "Authorization": `bearer ${loginToken}`
        }
      })
        .then((response) => {
          if(response.data.AdminPD){
            var AdminPD = response.data.AdminPD;
            res.locals.pageTitle = "Admin Profile";
            res.locals.success_msg_ = "Update Successful";
            req.user.details = AdminPD;
            return res.render("admin/update/updateAdminProfile", {
              _id: AdminPD._id,
              firstName: AdminPD.firstName,
              lastName: AdminPD.lastName,
              email: AdminPD.email,
              mobileNumber: "0"+AdminPD.mobileNumber
            });
          }
        })
        .catch((err) => {
          if(err.response){
            res.locals.pageTitle = "Admin Profile";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.render("admin/update/updateAdminProfile", {
              _id: req.user.details._id,
              firstName: req.user.details.firstName,
              lastName: req.user.details.lastName,
              email: req.user.details.email,
              mobileNumber: req.user.details.mobileNumber
            });
          }
        });
    });
  }
  res.render("unAuthorized");
});

module.exports = routes;