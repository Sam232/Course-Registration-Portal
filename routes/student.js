const routes = require("express").Router();
const axios = require("axios");

const {ensureStudentAuthentication} = require("../config/auth");

//Renders Welcome Page For Viewing Total Number Of All Semester Courses And Student's Registered Courses 
routes.get("/welcome/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/student/welcome/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var scrcNumber = response.data.scrcNumber;
          res.locals.pageTitle = "Welcome";
          res.render("student/welcome", {
            allSemestersCourses: scrcNumber.allSemestersCourses.length || 0,
            registeredCourses: scrcNumber.registeredCourses.length || 0
          });                
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("student/welcome", {
            allSemestersCourses: null,
            registeredCourses: null
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Renders Page For Viewing All Semester Courses
routes.get("/view/all/semester-courses/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/student/welcome/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var scrcNumber = response.data.scrcNumber;
          res.locals.pageTitle = "All Semester Courses";
          res.locals.error_msg_ = scrcNumber.allSemestersCourses.length ? null : "No Courses Available For All Semesters";
          res.render("student/view/allSemestersCourses", {
            allSemestersCourses: scrcNumber.allSemestersCourses
          });                
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("student/welcome", {
            allSemestersCourses: null,
            registeredCourses: null
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Renders Page For Viewing Student's Registered Courses
routes.get("/view/registered/semester-courses/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/student/welcome/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var scrcNumber = response.data.scrcNumber;
          res.locals.pageTitle = "My Registered Courses";
          res.locals.error_msg_ = scrcNumber.registeredCourses.length ? null : "You Have Not Registered For Any Courses Yet.";
          res.render("student/view/registeredCourses", {
            registeredCourses: scrcNumber.registeredCourses
          });                
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("student/welcome", {
            allSemestersCourses: null,
            registeredCourses: null
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Renders Page For A Student To Register Courses
routes.get("/register/courses/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/student/welcome/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var scrcNumber = response.data.scrcNumber;
          res.locals.pageTitle = "Register Courses";
          res.locals.error_msg_ = scrcNumber.allSemestersCourses.length ? null : "No Courses Available For Registration";
          res.render("student/add/registerCourses", {
            registerCourses: scrcNumber.allSemestersCourses
          });                
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("student/welcome", {
            allSemestersCourses: null,
            registeredCourses: null
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Register Student Course
routes.post("/add/course/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    var courseCode = req.body.courseCode;

    return axios.get(`https://gtuccrrestapi.herokuapp.com/student/welcome/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var allSemestersCourses = response.data.scrcNumber.allSemestersCourses;
          var fetchedCourse = allSemestersCourses.filter(semesterCourse => semesterCourse.code == courseCode);

          if(fetchedCourse.length > 0){
            var course = fetchedCourse[0];
            var newCourse = {
              code: course.code,
              name: course.name,
              level: course.level,
              creditHours: course.creditHours,
              semester: course.semester,
              lecturerId: course.lecturerId._id
            };

            return axios.post(`https://gtuccrrestapi.herokuapp.com/student/add/course/${req.user.details._id}`, newCourse, {
              headers: {
                "Authorization": `bearer ${req.user.token}`
              }
            })
              .then((response) => {
                if(response){
                  if(response.data.addState == "successful"){
                    return res.status(200).json({
                      addState: "Successful"
                    });
                  }
                  res.status(404).json({
                    errorMsg: response.data.msg
                  });
                }
              })
              .catch((err) => {
                if(err.response.data.errorMsg){
                  res.status(404).json({
                    errorMsg: err.response.data.errorMsg
                  });        
                }
              }); 
          }
          res.status(404).json({
            errorMsg: "An Error Occured, Try Again"
          });
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.status(404).json({
            errorMsg
          });
        }
      });    
  }
  res.render("unAuthorized");
});

//Deleted Registered Course
routes.delete("/delete/course/:courseCode", ensureStudentAuthentication, (req, res) => {
  var courseCode = req.params.courseCode;
  if(req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/student/delete/course/${courseCode}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.deleteState == "successful"){
            res.status(200).json({
              deleteState: "Successful",
              courseName: response.data.deletedCourse.name
            });
          }
        }
      })
      .catch((err) => {
        if(err.response.data.errorMsg){
          res.status(404).json({
            errorMsg: err.response.data.errorMsg
          });        
        }
      }); 
  }
  res.render("unAuthorized");
});

//Renders Page For Viewing Grades
routes.get("/request/grades", ensureStudentAuthentication, (req, res) => {  
  if(req.user.token){
    res.locals.pageTitle = "Request Grades"
    return res.render("student/request/grade", {
      indexNumber: req.user.details.indexNumber
    });
  }
  res.render("unAuthorized");
});

//Fetch Student's Grades
routes.post("/request/grades/", ensureStudentAuthentication, (req, res) => {
  var studentId = req.user.details._id;
  var indexNumber = req.user.details.indexNumber;
  var level = req.body.level;
  var semester = req.body.semester;

  if(req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/student/view/grade/${studentId}/${indexNumber}/${level}/${semester}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          res.locals.pageTitle = "Semester Grades";
          return res.render("student/view/grade", {
            grades: response.data.fetchedGrade
          });
        }
      })
      .catch((err) => {
        if(err.response.data.errorMsg){
          res.locals.pageTitle = "Request Grades";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect("/student/request/grades");
        }
      });
  }
  res.render("unAuthorized");
});

//Render Page For Updating Personal Details
routes.get("/update/profile", ensureStudentAuthentication, (req, res) => {
  var token = req.params.token;
  var studentId = req.params.id;
  var personalDetails = req.user.details;

  if(req.user.token){
    res.locals.pageTitle = "Update Personal Details"
    return res.render("student/update/profile", {
      firstName: personalDetails.firstName,
      lastName: personalDetails.lastName,
      indexNumber: personalDetails.indexNumber,
      email: personalDetails.email,
      mobileNumber: "0"+personalDetails.mobileNumber
    });
  }
  res.render("unAuthorized");
});

//Update Student's Details
routes.put("/update/profile", ensureStudentAuthentication, (req, res) => {
  var studentId = req.user.details._id;
  
  if(req.user.token){
    var studentDetails = {
      _id: studentId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      indexNumber: req.body.indexNumber,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    }

    return axios.put(`https://gtuccrrestapi.herokuapp.com/student/update/${studentId}`, studentDetails, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          req.user.details = studentDetails;
          res.locals.pageTitle = "Update Personal Details";
          res.locals.success_msg_ = "Update Successful";
          return res.render("student/update/profile", {
            firstName: studentDetails.firstName,
            lastName: studentDetails.lastName,
            indexNumber: studentDetails.indexNumber,
            email: studentDetails.email,
            mobileNumber: studentDetails.mobileNumber
          }); 
        }
      })
      .catch((err) => {
        if(err){
          var result = err.response;
          if(result.data.errorMsg){
            res.locals.pageTitle = "Update Personal Details";
            res.locals.error_msg_ = result.data.errorMsg;
            return res.render("student/update/profile", {
              firstName: studentDetails.firstName,
              lastName: studentDetails.lastName,
              indexNumber: studentDetails.indexNumber,
              email: studentDetails.email,
              mobileNumber: studentDetails.mobileNumber
            }); 
          }        
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Updating Login Details
routes.get("/update/login-details", ensureStudentAuthentication, (req, res) => {  
  if(req.user.token){
    res.locals.pageTitle = "Update Login Details"
    return res.render("student/update/loginDetails", {
      indexNumber: req.user.details.indexNumber
    });
  }
  res.render("unAuthorized");
});

//Update Student's Login Details
routes.put("/update/login-details/", ensureStudentAuthentication, (req, res) => {
  if(req.user.token){
    var loginDetails = {
      indexNumber: req.user.details.indexNumber,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword
    }
    
    return axios.put("https://gtuccrrestapi.herokuapp.com/student/update/student/login", loginDetails ,{
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          res.locals.pageTitle = "Update Login Details";
          res.locals.success_msg_ = "Update Successful";
          return res.render("student/update/loginDetails", {
            indexNumber: loginDetails.indexNumber
          }); 
        }
      })
      .catch((err) => {
        if(err){
          var result = err.response;
          if(result.data){
            res.locals.pageTitle = "Update Login Details";
            res.locals.error_msg_ = result.data.errorMsg;
            return res.render("student/update/loginDetails", {
              indexNumber: req.user.details.indexNumber
            });
          }           
        }
      });  
  }
  res.render("unAuthorized");
});

module.exports = routes;