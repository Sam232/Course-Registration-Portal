const routes = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const {ensureFinanceAuthentication} = require("../config/auth");

routes.get("/welcome/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/payments/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
    .then((response) => {
      if(response){
        var payments = response.data.financePayment;
        res.locals.pageTitle = "Welcome";
        res.render("finance/welcome", {
          allEnabledPayments: payments.allEnabledPayments.length || 0,
          myEnabledPayments: payments.myEnabledPayments.length || 0
        });                
      }
    })
    .catch((err) => {
      if(err.response.data){
        res.locals.pageTitle = "Welcome";
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.render("finance/welcome", {
          allEnabledPayments: null,
          myEnabledPayments: null
        });
      }
    });
  }
  res.render("unAuthorized");
});

//View All Payments
routes.get("/view/all/student-payments/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/payments/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
    .then((response) => {
      if(response){
        var payments = response.data.financePayment;
        res.locals.pageTitle = "All Enabled Payments";

        if(payments.length > 0){          
          return res.render("finance/view/allEnabledPayments", {
            allEnabledPayments: payments.allEnabledPayments
          }); 
        }
        res.locals.error_msg_ = response.data.msg;
        res.render("finance/view/allEnabledPayments", {
          allEnabledPayments: payments.allEnabledPayments
        });                
      }
    })
    .catch((err) => {
      if(err.response.data){
        res.locals.pageTitle = "All Enabled Payments";
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.render("finance/view/allEnabledPayments", {
          allEnabledPayments: []
        });
      }
    });
  }
  res.render("unAuthorized");
});

//View Financial Accountant's Enabled Payments
routes.get("/view/my/enabled/student-payments/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/payments/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
    .then((response) => {
      if(response){
        var myPayments = response.data.financePayment.myEnabledPayments;
        res.locals.pageTitle = "My Enabled Payments";

        if(myPayments.length > 0){          
          return res.render("finance/view/myEnabledPayments", {
            myPayments
          }); 
        }
        res.locals.error_msg_ = "You Have Not Enabled Any Payments";
        res.render("finance/view/myEnabledPayments", {
          myPayments: []
        });                
      }
    })
    .catch((err) => {
      if(err.response.data){
        res.locals.pageTitle = "My Enabled Payments";
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.render("finance/view/myEnabledPayments", {
          myPayments: []
        });
      }
    });
  }
  res.render("unAuthorized");
});

//Renders Page For Adding New Payment
routes.get("/add/student-payment/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    res.locals.pageTitle = "Add New Payment";
    return res.render("finance/add/newPayment");
  }
  res.render("unAuthorized");
});

//Add New Student Payment
routes.post("/add/student-payment/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  var financeId = req.user.details._id;

  if(token === req.user.token){
    var paymentDetails = {
      indexNumber: req.body.indexNumber,
      level: req.body.level,
      semester: req.body.semester,
    };

    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/single/student/${paymentDetails.indexNumber}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        res.locals.pageTitle = "Add Student Payment";
        if(response.data.queryState == "successful"){
          return axios.post(`https://gtuccrrestapi.herokuapp.com/finance/add/payment/${financeId}`, paymentDetails, {
            headers: {
              "Authorization": `bearer ${token}`
            }
          })
            .then((response) => {
              res.locals.pageTitle = "Add Student Payment";
              if(response.data.addState == "successful"){                
                req.flash("success_msg", "New Payment Added");
                return res.redirect(`/finance/add/student-payment/${token}`);
              }
              req.flash("error_msg", response.data.msg);
              res.redirect(`/finance/add/student-payment/${token}`);
            })
            .catch((err) => {
              if(err.response){
                res.locals.pageTitle = "Add Student Payment";
                if(err.response.data.errorMsg){                  
                  res.locals.error_msg_ = err.response.data.errorMsg;
                  return res.render("finance/add/newPayment", {
                    indexNumber: paymentDetails.indexNumber,
                    level: paymentDetails.level,
                    semester: paymentDetails.semester
                  });
                }
              }
            }); 
        }
        res.locals.error_msg_ = response.data.msg;
        res.render("finance/add/newPayment", {
          indexNumber: paymentDetails.indexNumber,
          level: paymentDetails.level,
          semester: paymentDetails.semester
        });
      })
      .catch((err) => {
        if(err){
          if(err.response.data){
            res.locals.pageTitle = "Add Student Payment";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.render("finance/add/newPayment", {
              indexNumber: paymentDetails.indexNumber,
              level: paymentDetails.level,
              semester: paymentDetails.semester
            });
          }          
        }
      });  
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Student Payments To Be Updated
routes.get("/update/student-payments/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/payments/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
    .then((response) => {
      if(response){
        var myPayments = response.data.financePayment.myEnabledPayments;
        res.locals.pageTitle = "My Enabled Payments";

        if(myPayments.length > 0){          
          return res.render("finance/update/allStudentPayments", {
            myPayments
          }); 
        }
        res.locals.error_msg_ = "You Have Not Enabled Any Payments";
        res.render("finance/update/allStudentPayments", {
          myPayments: []
        });                
      }
    })
    .catch((err) => {
      if(err.response.data){
        res.locals.pageTitle = "My Enabled Payments";
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.render("finance/update/allStudentPayments", {
          myPayments: []
        });
      }
    });
  }
  res.render("unAuthorized");
});

//Fetch Selected Student Payment
routes.get("/update/selected-student/payment/:id/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  var paymentId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/payments/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
    .then((response) => {
      if(response){
        res.locals.pageTitle = "Update Student Payment";
        var myEnabledPayments = response.data.financePayment.myEnabledPayments;

        var payment = myEnabledPayments.filter(payment => payment._id === paymentId);

        var levels = [100, 200, 300, 400];
        var selectedLevel = levels.filter(level => level !== payment[0].level);
        selectedLevel.unshift(payment[0].level);

        var semesters = [1, 2];
        var selectedSemester = semesters.filter(semester => semester !== payment[0].semester);
        selectedSemester.unshift(payment[0].semester);

        if(payment.length > 0){          
          return res.render("finance/update/studentPayment", {
            _id: payment[0]._id,
            indexNumber: payment[0].indexNumber,
            level: selectedLevel,
            semester: selectedSemester
          }); 
        }
        res.locals.error_msg_ = "Unable To Fetch Payment Details, Try Again";
        res.render("finance/update/allStudentPayments", {
          myPayments: []
        });                
      }
    })
    .catch((err) => {
      if(err.response.data){
        res.locals.pageTitle = "My Enabled Payments";
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.render("finance/update/allStudentPayments", {
          myPayments: []
        });
      }
    });
  }
  res.render("unAuthorized");
});

//Update Student's Payment Details
routes.put("/update/selected-payment/:id/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  var paymentId = req.params.id;
  
  if(token === req.user.token){
    var paymentDetails = {
      indexNumber: req.body.indexNumber,
      level: req.body.level,
      semester: req.body.semester
    }

    return axios.put(`https://gtuccrrestapi.herokuapp.com/finance/update/payment/${paymentId}`, paymentDetails, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          var result = response.data.updatedPayment;

          var levels = [100, 200, 300, 400];
          var selectedLevel = levels.filter(level => level !== result.level);
          selectedLevel.unshift(result.level);

          var semesters = [1, 2];
          var selectedSemester = semesters.filter(semester => semester !== result.semester);
          selectedSemester.unshift(result.semester);

          res.locals.pageTitle = "Update Student";
          res.locals.success_msg_ = "Update Successful";
          return res.render("finance/update/studentPayment", {
            _id: result._id,
            indexNumber: result.indexNumber,
            level: selectedLevel,
            semester: selectedSemester
          }); 
        }
        res.locals.pageTitle = "Update Student";
        res.locals.error_msg_ = "Update Unsuccessful, Try Again";
        res.render("finance/update/studentPayment", {
          _id: paymentId,
          indexNumber: paymentDetails.indexNumber,
          level: paymentDetails.level,
          semester: paymentDetails.semester
        }); 
      })
      .catch((err) => {
        if(err){
          var result = err.response;

          if(result.data.errorMsg == "Invalid Payment ID Provided" || result.data.errorMsg == "No Payment\'s ID Matches The Provided ID"){
            res.locals.pageTitle = "Update Student";
            res.locals.error_msg_ = result.data.errorMsg;
            return res.redirect(`/finance/update/student-payments/${token}`);
          }
          res.locals.pageTitle = "Update Student";
          res.locals.error_msg_ = result.data.errorMsg;
          res.render("finance/update/studentPayment", {
            _id: paymentId,
            indexNumber: paymentDetails.indexNumber,
            level: paymentDetails.level,
            semester: paymentDetails.semester
          });           
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Deleting Student Payment
routes.get("/delete/student/payment/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){     
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/payments/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
    .then((response) => {
      if(response){
        var myPayments = response.data.financePayment.myEnabledPayments;
        res.locals.pageTitle = "Delete Payments";

        if(myPayments.length > 0){          
          return res.render("finance/delete/payments", {
            myPayments
          }); 
        }
        res.locals.error_msg_ = "You Have Not Enabled Any Payments";
        res.render("finance/delete/payments", {
          myPayments: []
        });                
      }
    })
    .catch((err) => {
      if(err.response.data){
        res.locals.pageTitle = "Delete Payments";
        res.locals.error_msg_ = err.response.data.errorMsg;
        res.render("finance/delete/payments", {
          myPayments: []
        });
      }
    });
  }
  res.render("unAuthorized");
});

//Delete Student Payment Details
routes.delete("/delete/selected-student/payment/:id/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  var paymentId = req.params.id;

  if(token === req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/finance/delete/payment/${paymentId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Student Payments";
          req.flash("success_msg", "Delete Successful");
          return res.redirect(`/finance/delete/student/payment/${token}`);
        }
      })
      .catch((err) => {
        if(err.response){
          res.locals.pageTitle = "Student Payments";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/finance/delete/student/payment/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Financial Accountant's Personal Details
routes.get("/finance-login-details/:token", ensureFinanceAuthentication, (req, res) => {
  var token = req.params.token;
  var financeId = req.user.details._id;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/finance/${financeId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Financial Accountant\'s Profile";
          return res.render("finance/update/financialAccountantProfile", {
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
          if(err.response.data.errorMsg == "Unable To Fetch Financial Accountant\'s Personal Details"){
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            req.flash("error_msg", "Unable To Fetch Your Personal Details, Try Again");
            res.redirect(`/finance/welcome/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Confirm Update To Financial Accountant's Personal Details
routes.post("/confirm-update/:id/:token", ensureFinanceAuthentication, (req, res) => {
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
        res.locals.pageTitle = "Financial Accountant Profile";
        res.locals.error_msg_ = "An Error Occured, Try Again";
        return res.render("finance/update/financialAccountantProfile", {
          _id: updateDetails.id,
          firstName: updateDetails.firstName,
          lastName: updateDetails.lastName,
          email: updateDetails.email,
          mobileNumber: updateDetails.mobileNumber
        });
      }

      var financeDetails = req.user.details;
      var emailDetails = {
        firstName: financeDetails.firstName,
        financeEmail: financeDetails.email,
        loginToken: req.user.token,
        token
      };

      axios.post("https://gtuccrrestapi.herokuapp.com/finance/confirm-update", emailDetails, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.emailSent){
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.success_msg_ = "A Confirm Update Link Has Been Sent To Your Email. Click On The Link To Complete The Update";
            return res.render("finance/update/financialAccountantProfile", {
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
            return res.render("finance/update/financialAccountantProfile", {
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
routes.get("/confirm-update/:loginToken/:token", ensureFinanceAuthentication, (req, res) => {
  var loginToken = req.params.loginToken;
  var token = req.params.token;

  if(loginToken === req.user.token){
    return jwt.verify(token, "secretKey", (err, authData) => {
      if(err){
        if(err.name == "TokenExpiredError"){
          res.locals.pageTitle = "Financial Accountant\'s Profile";
          res.locals.error_msg_ = "Update Link Expired, Re-Update Your Profile";
          return res.render("finance/update/financialAccountantProfile", {
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
      axios.put(`https://gtuccrrestapi.herokuapp.com/finance/update/finance/${updateDetails.id}`, updateDetails, {
        headers: {
          "Authorization": `bearer ${loginToken}`
        }
      })
        .then((response) => {
          if(response.data.FinancePD){
            var FinancePD = response.data.FinancePD;
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.success_msg_ = "Update Successful";
            req.user.details = FinancePD;
            return res.render("finance/update/financialAccountantProfile", {
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
            res.locals.pageTitle = "Financial Accountant\'s Profile";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.render("finance/update/financialAccountantProfile", {
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