const routes = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const readExcelFile = require("read-excel-file/node");
const fs = require("fs");
const path = require("path");

const {ensureLecturerAuthentication} = require("../config/auth");

//Renders Page For Lecturers To View Their Added Courses, Course Registerants And Grades
routes.get("/welcome/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/welcome/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          var sgcNumber = response.data.sgcNumber;
          res.locals.pageTitle = "Welcome";
          res.render("lecturer/welcome", {
            studentsNumber: sgcNumber.rcourses,
            coursesNumber: sgcNumber.courses,
            gradesNumber: sgcNumber.grades
          });
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.render("lecturer/welcome", {
            studentsNumber: null,
            coursesNumber: null,
            gradesNumber: null
          });
        }
      });
  }
  res.render("unAuthorized");
});

//Renders Page For Viewing Course Registrants
routes.get("/view/students/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/course/registrants/${req.user.details._id}`, {
        headers: {
          "Authorization": `bearer ${token}`
        }
    })
      .then((response) => {
        if(response){
          if(response.data.students.length > 0){
            res.locals.pageTitle = "Students";
            return res.render("lecturer/view/courseRegistrants", {
              students: response.data.students
            });
          }
          res.locals.pageTitle = "Students";
          res.locals.error_msg_ = "No Students Have Registrated For Your Courses Yet."
          res.render("lecturer/view/courseRegistrants", {
            students: response.data.students
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });   
  }
  res.render("unAuthorized");
});

//Renders Page For Viewing Courses
routes.get("/view/courses/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/course/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.courses.length > 0){
            res.locals.pageTitle = "Courses";
            return res.render("lecturer/view/courses", {
              courses: response.data.courses
            });
          }
          res.locals.pageTitle = "Courses";
          res.locals.error_msg_ = "No Courses Have Been Added Yet."
          res.render("lecturer/view/courses", {
            courses: response.data.courses
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Viewing Grades
routes.get("/view/grades/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/grades/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.grades.length > 0){
            res.locals.pageTitle = "Students Grade";
            return res.render("lecturer/view/grades", {
              grades: response.data.grades
            });
          }
          res.locals.pageTitle = "Students Grade";
          res.locals.error_msg_ = "No Grades Have Been Added Yet."
          res.render("lecturer/view/grades", {
            grades: response.data.grades
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Adding Courses
routes.get("/add/course/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    res.locals.pageTitle = "Add New Course";
    return res.render("lecturer/add/newCourse");
  }
  res.render("unAuthorized");
});

//Add New Course
routes.post("/add/course/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.user.details._id;

  if(token === req.user.token){
    var newCourse = {
      code: req.body.code,
      name: req.body.name,
      creditHours: req.body.creditHours,
      level: req.body.level,
      semester: req.body.semester
    };

    return axios.post(`https://gtuccrrestapi.herokuapp.com/lecturer/add/course/${lecturerId}`, newCourse, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          var courseDetails = response.data.courseDetails;
          if(response.data.msg){
            res.locals.pageTitle = "Add Course";
            req.flash("success_msg", response.data.msg);
            return res.redirect(`/lecturer/add/course/${token}`);
          }
          res.locals.pageTitle = "Add Course";
          req.flash("success_msg", "New Course Added");
          res.redirect(`/lecturer/add/course/${token}`);
        }
      })
      .catch((err) => {
        if(err.response.data.errorMsg){
          res.locals.pageTitle = "Add Course";
          res.locals.error_msg_ = err.response.data.errorMsg
          res.render("lecturer/add/newCourse", {
            code: newCourse.code,
            name: newCourse.name,
            creditHours: newCourse.creditHours,
            level: newCourse.level,
            semester: newCourse.semester
          });        
        }
      }); 
  }
  res.render("unAuthorized");
});

//Renders Page For Adding New Student Grade
routes.get("/add/student-grade/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    res.locals.pageTitle = "Add New Grade";
    return res.render("lecturer/add/newGrade");
  }
  res.render("unAuthorized");
});

//Add New Grade
routes.post("/add/student-grade/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.user.details._id;

  if(token === req.user.token){
    var newGrade = {
      courseCode: req.body.code,
      courseName: req.body.name,
      grade: req.body.grade,
      marks: req.body.marks,
      level: req.body.level,
      semester: req.body.semester,
      indexNumber: req.body.indexNumber
    };

    return axios.post(`https://gtuccrrestapi.herokuapp.com/lecturer/add/grade/${lecturerId}`, newGrade, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          var addedGrade = response.data.addedGrade;
          if(response.data.addState == "successful" && response.data.smsSent == true && addedGrade !== "undefined"){
            res.locals.pageTitle = "Add Student Grade";
            req.flash("success_msg", "New Grade Added And The Student Was Notified Through SMS");
            return res.redirect(`/lecturer/add/student-grade/${token}`);
          }
          res.locals.pageTitle = "Add Student Grade";
          req.flash("success_msg", "New Grade Added But The Student Was Not Notified Through SMS");
          res.redirect(`/lecturer/add/student-grade/${token}`); 
        }
      })
      .catch((err) => {
        if(err.response.data.errorMsg){
          res.locals.pageTitle = "Add Student Grade";
          res.locals.error_msg_ = err.response.data.errorMsg;
          return res.render("lecturer/add/newGrade", {
            code: newGrade.courseCode,
            name: newGrade.courseName,
            grade: newGrade.grade,
            marks: newGrade.marks,
            level: newGrade.level,
            semester: newGrade.semester,
            indexNumber: newGrade.indexNumber
          });          
        }
        res.locals.pageTitle = "Add Student Grade";
        req.flash("success_msg", "New Grade Added But The Student Was Not Notified Through SMS");
        res.redirect(`/lecturer/add/student-grade/${token}`); 
      }); 
  }
  res.render("unAuthorized");
});

//Add Two Or More Students Grades Contained In An Excel File
routes.post("/add/students-grades/:token", ensureLecturerAuthentication, (req, res) => {
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
    }).single("studentsGradeFile");

    return upload(req, res, (err) => {
      if(err){
        res.locals.pageTitle = "Add Student Grades";
        req.flash("error_msg", "A Valid SpreadSheet File With .xlsx Extension Should Be Uploaded");
        return res.redirect(`/lecturer/add/student-grade/${token}`);
      }
 
      readExcelFile(`./public/${excelFile}`).then((rows) => {
        if(rows.length > 0){
          return rows.forEach((gradeDetails, index) => {
            if(gradeDetails && index > 0){
              var studentGrade = {
                code: gradeDetails[0],
                name: gradeDetails[1],
                grade: gradeDetails[2],
                marks: gradeDetails[3],
                level: gradeDetails[4],
                semester: gradeDetails[5],
                indexNumber: gradeDetails[6]
              };
              axios.post(`https://gtuccrrestapi.herokuapp.com/lecturer/add/grade/${req.user.details._id}`, {
                courseCode: studentGrade.code,
                courseName: studentGrade.name,
                grade: studentGrade.grade,
                marks: studentGrade.marks,
                level: studentGrade.level,
                semester: studentGrade.semester,
                indexNumber: studentGrade.indexNumber
              }, {
                headers: {
                  "Authorization": `bearer ${token}`
                }
              })
                .then((response) => {
                  if(response.data){
                    var newRowLength = rows.length - 1;
                    if(index == newRowLength){
                      return fs.unlink(`./public/${excelFile}`, (err) => {
                        if(err){
                          req.flash("error_msg", "An Error Occured While Adding The Students Details Contained In The Excel File, Try Again");
                          res.redirect(`/lecturer/add/student-grade/${token}`);
                        }
                        else{
                          req.flash("success_msg", "New Students Grades Added");
                          res.redirect(`/lecturer/add/student-grade/${token}`);
                        }
                      });
                    }
                    index++;
                  }
                })
                .catch((err) => {
                  if(err.response){
                    req.flash("error_msg", err.response.data.errorMsg);
                    res.redirect(`/lecturer/add/student-grade/${token}`);
                  }
                });   
            }
          });
        }
        req.flash("error_msg", "No Personal Details Of Students Are Contained In The Excel File");
        res.redirect(`/lecturer/add/student-grade/${token}`);
      })
      .catch((err) => {
        if(err){
          res.locals.pageTitle = "Add Grade";
          req.flash("error_msg", "No Grade Details Of Students Are Contained In The Excel File");
          res.redirect(`/lecturer/add/student-grade/${token}`);
        }
      });
    });
  }
  res.render("unAuthorized");
});


//Renders Page For Updating Course
routes.get("/update/courses/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/course/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.courses.length > 0){
            res.locals.pageTitle = "Courses";
            return res.render("lecturer/update/courses", {
              courses: response.data.courses
            });
          }
          res.locals.pageTitle = "Courses";
          res.locals.error_msg_ = "No Courses Have Been Added Yet."
          res.render("lecturer/update/courses", {
            courses: response.data.courses
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Updating Grades
routes.get("/update/student/grades/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/grades/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.grades.length > 0){
            res.locals.pageTitle = "Students Grade";
            return res.render("lecturer/update/grades", {
              grades: response.data.grades
            });
          }
          res.locals.pageTitle = "Students Grade";
          res.locals.error_msg_ = "No Grades Have Been Added Yet."
          res.render("lecturer/update/grades", {
            grades: response.data.grades
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Fetch Selected Course
routes.get("/update/selected-course/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var courseId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/single/course/${courseId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.courseDetails;
          res.locals.pageTitle = "Update Course";

          var levels = [100, 200, 300, 400];
          var selectedLevel = levels.filter(level => level !== result.level);
          selectedLevel.unshift(result.level);

          var semesters = [1, 2];
          var selectedSemester = semesters.filter(semester => semester !== result.semester);
          selectedSemester.unshift(result.semester);

          var creditHours = [1, 2, 3];
          var selectedCreditHours = creditHours.filter(creditHour => creditHour !== result.creditHours);
          selectedCreditHours.unshift(result.creditHours);
         
          return res.render("lecturer/update/updateSingleCourse", {
            _id: result._id,
            code: result.code,
            name: result.name,
            creditHours: selectedCreditHours,
            level: selectedLevel,
            semester: selectedSemester
          });
        }
        res.locals.pageTitle = "Courses";
        req.flash("error_msg", response.data.msg);
        res.redirect(`/lecturer/update/courses/${token}`);
      })
      .catch((err) => {
        if(err){
          if(err.response.data){
            res.locals.pageTitle = "Courses";
            req.flash("error_msg", err.response.data.errorMsg);
            res.redirect(`/lecturer/update/courses/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Fetch Selected Grade
routes.get("/update/selected-grade/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var gradeId = req.params.id;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/single/grade/${gradeId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.gradeDetails;

          var grades = ["A", "B", "C", "D", "E", "F"];
          var selectedGrade = grades.filter(grade => grade !== result.grade);
          selectedGrade.unshift(result.grade);

          var levels = [100, 200, 300, 400];
          var selectedLevel = levels.filter(level => level !== result.level);
          selectedLevel.unshift(result.level);

          var semesters = [1, 2];
          var selectedSemester = semesters.filter(semester => semester !== result.semester);
          selectedSemester.unshift(result.semester);

          res.locals.pageTitle = "Update Grade";
          return res.render("lecturer/update/updateSingleGrade", {
            _id: result._id,
            code: result.courseCode,
            name: result.courseName,
            grade: selectedGrade,
            marks: result.marks,
            level: selectedLevel,
            semester: selectedSemester,
            indexNumber: result.indexNumber
          });
        }
        res.locals.pageTitle = "Grades";
        req.flash("error_msg", response.data.msg);
        res.redirect(`/lecturer/update/student/grades/${token}`);
      })
      .catch((err) => {
        if(err){
          if(err.response.data){
            res.locals.pageTitle = "Grades";
            req.flash("error_msg", err.response.data.errorMsg);
            res.redirect(`/lecturer/update/student/grades/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Update Course Details
routes.put("/update/selected-course/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var courseId = req.params.id;

  if(token === req.user.token){
    var courseDetails = {
      code: req.body.code,
      name: req.body.name,
      creditHours: req.body.creditHours,
      level: req.body.level,
      semester: req.body.semester
    }

    return axios.put(`https://gtuccrrestapi.herokuapp.com/lecturer/update/course/${courseId}`, courseDetails, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          var result = response.data.updatedCourse;

          var levels = [100, 200, 300, 400];
          var selectedLevel = levels.filter(level => level !== result.level);
          selectedLevel.unshift(result.level);

          var semesters = [1, 2];
          var selectedSemester = semesters.filter(semester => semester !== result.semester);
          selectedSemester.unshift(result.semester);

          var creditHours = [1, 2, 3];
          var selectedCreditHours = creditHours.filter(creditHour => creditHour !== result.creditHours);
          selectedCreditHours.unshift(result.creditHours);
   
          res.locals.pageTitle = "Update Course";
          res.locals.success_msg_ = "Update Successful";
          return res.render("lecturer/update/updateSingleCourse", {
            _id: courseId,
            code: result.code,
            name: result.name,
            creditHours: selectedCreditHours,
            level: selectedLevel,
            semester: selectedSemester
          }); 
        } 
      })
      .catch((err) => {
        if(err){
          var result = err.response;
          if(result.data.updateState == "unsuccessful"){
            res.locals.pageTitle = "Update Student";
            res.locals.error_msg_ = result.data.errorMsg;

            var levels = [100, 200, 300, 400];
            var selectedLevel = levels.filter(level => level !== courseDetails.level);
            selectedLevel.unshift(courseDetails.level);

            var semesters = [1, 2];
            var selectedSemester = semesters.filter(semester => semester !== courseDetails.semester);
            selectedSemester.unshift(courseDetails.semester);

            var creditHours = [1, 2, 3];
            var selectedCreditHours = creditHours.filter(creditHour => creditHour !== courseDetails.creditHours);
            selectedCreditHours.unshift(courseDetails.creditHours);

            return res.render("lecturer/update/updateSingleCourse", {
              _id: courseId,
              code: courseDetails.code,
              name: courseDetails.name,
              creditHours: selectedCreditHours,
              level: selectedLevel,
              semester: selectedSemester
            }); 
          }
          res.locals.pageTitle = "Update Course";
          req.flash("error_msg", result.data.errorMsg);
          res.redirect(`/lecturer/update/courses/${token}`); 
        }
      });  
  }
  res.render("unAuthorized");
});

//Update Grade Details
routes.put("/update/selected-student-grade/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var gradeId = req.params.id;

  if(token === req.user.token){
    var gradeDetails = {
      courseCode: req.body.code,
      courseName: req.body.name,
      grade: req.body.grade,
      marks: req.body.marks,
      level: req.body.level,
      semester: req.body.semester,
      indexNumber: req.body.indexNumber
    }

    return axios.put(`https://gtuccrrestapi.herokuapp.com/lecturer/update/grade/${gradeId}`, gradeDetails, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.updateState == "successful"){
          var result = response.data.updatedGrade;

          var grades = ["A", "B", "C", "D", "E", "F"];
          var selectedGrade = grades.filter(grade => grade !== result.grade);
          selectedGrade.unshift(result.grade);

          var levels = [100, 200, 300, 400];
          var selectedLevel = levels.filter(level => level !== result.level);
          selectedLevel.unshift(result.level);

          var semesters = [1, 2];
          var selectedSemester = semesters.filter(semester => semester !== result.semester);
          selectedSemester.unshift(result.semester);

          res.locals.pageTitle = "Update Grade";
          res.locals.success_msg_ = "Update Successful";
          return res.render("lecturer/update/updateSingleGrade", {
            _id: result._id,
            code: result.courseCode,
            name: result.courseName,
            grade: selectedGrade,
            marks: result.marks,
            level: selectedLevel,
            semester: selectedSemester,
            indexNumber: result.indexNumber
          }); 
        } 
      })
      .catch((err) => {
        if(err){
          var result = err.response;
          if(result.data.updateState == "unsuccessful"){
            res.locals.pageTitle = "Update Grade";
            res.locals.error_msg_ = result.data.errorMsg;

            var grades = ["A", "B", "C", "D", "E", "F"];
            var selectedGrade = grades.filter(grade => grade !== gradeDetails.grade);
            selectedGrade.unshift(gradeDetails.grade);

            var levels = [100, 200, 300, 400];
            var selectedLevel = levels.filter(level => level !== gradeDetails.level);
            selectedLevel.unshift(gradeDetails.level);

            var semesters = [1, 2];
            var selectedSemester = semesters.filter(semester => semester !== gradeDetails.semester);
            selectedSemester.unshift(gradeDetails.semester);

            return res.render("lecturer/update/updateSingleGrade", {
              _id: gradeId,
              code: gradeDetails.courseCode,
              name: gradeDetails.courseName,
              grade: selectedGrade,
              marks: gradeDetails.marks,
              level: selectedLevel,
              semester: selectedSemester,
              indexNumber: gradeDetails.indexNumber
            }); 
          }
          res.locals.pageTitle = "Update Grade";
          req.flash("error_msg", result.data.errorMsg);
          res.redirect(`/lecturer/update/student/grades/${token}`);                    
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Deleting Courses
routes.get("/delete/courses/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/course/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${req.user.token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.courses.length > 0){
            res.locals.pageTitle = "Courses";
            return res.render("lecturer/delete/courses", {
              courses: response.data.courses
            });
          }
          res.locals.pageTitle = "Courses";
          res.locals.error_msg_ = "No Courses Have Been Added Yet."
          res.render("lecturer/delete/courses", {
            courses: response.data.courses
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Renders Page For Deleting Grades
routes.get("/delete/student/grades/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;

  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/grades/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.grades.length > 0){
            res.locals.pageTitle = "Students Grade";
            return res.render("lecturer/delete/grades", {
              grades: response.data.grades
            });
          }
          res.locals.pageTitle = "Students Grade";
          res.locals.error_msg_ = "No Grades Have Been Added Yet."
          res.render("lecturer/delete/grades", {
            grades: response.data.grades
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Delete Course Details
routes.delete("/delete/selected-course/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var courseId = req.params.id;

  if(token === req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/lecturer/delete/course/${courseId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Courses";
          req.flash("success_msg", "Delete Successful");
          return res.redirect(`/lecturer/delete/courses/${token}`);
        }
      })
      .catch((err) => {
        if(err.response){
          res.locals.pageTitle = "Courses";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/lecturer/delete/courses/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Delete Grade Details
routes.delete("/delete/selected-student-grade/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var gradeId = req.params.id;

  if(token === req.user.token){
    return axios.delete(`https://gtuccrrestapi.herokuapp.com/lecturer/delete/grade/${gradeId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          res.locals.pageTitle = "Grades";
          req.flash("success_msg", "Delete Successful");
          return res.redirect(`/lecturer/delete/student/grades/${token}`);
        }
      })
      .catch((err) => {
        if(err.response){
          res.locals.pageTitle = "Grades";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/lecturer/delete/student/grades/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//View Saved Courses
routes.get("/view/saved/courses/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/saved/courses/${req.user.details._id}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.savedCourse.length > 0){
            res.locals.pageTitle = "Saved Courses";
            return res.render("lecturer/view/savedCourses", {
              courses: response.data.savedCourse
            });
          }
          res.locals.pageTitle = "Saved Courses";
          res.locals.error_msg_ = "No Courses Have Been Added Yet."
          res.render("lecturer/view/savedCourses", {
            courses: response.data.savedCourse
          }); 
        }
      })
      .catch((err) => {
        if(err.response.data){
          res.locals.pageTitle = "Welcome";
          res.locals.error_msg_ = err.response.data.errorMsg;
          res.redirect(`/lecturer/welcome/${token}`);
        }
      });  
  }
  res.render("unAuthorized");
});

//Add Saved Course As New Course
routes.post("/add/saved/course/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.user.details._id;

  if(token === req.user.token){
    var newCourse = {
      code: req.body.code,
      name: req.body.name,
      creditHours: req.body.creditHours,
      level: req.body.level,
      semester: req.body.semester
    };

    return axios.post(`https://gtuccrrestapi.herokuapp.com/lecturer/add/course/${lecturerId}`, newCourse, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response){
          if(response.data.msg){
            res.locals.pageTitle = "Saved Courses";
            req.flash("success_msg", response.data.msg);
            return res.redirect(`/lecturer/view/saved/courses/${token}`);
          }
          res.locals.pageTitle = "Saved Courses";
          req.flash("success_msg", "New Course Added");
          res.redirect(`/lecturer/view/saved/courses/${token}`);          
        }
      })
      .catch((err) => {
        if(err.response){
          var errorMsg = err.response.data.errorMsg;
          if(errorMsg == "Course Code Already Exist" || errorMsg == "Course Name Already Exist"){
            res.locals.pageTitle = "Saved Courses";
            req.flash("error_msg", "You Have Already Added This Course");
            return res.redirect(`/lecturer/view/saved/courses/${token}`); 
          }
          res.locals.pageTitle = "Saved Courses";
          req.flash("error_msg", err.response.data.errorMsg);
          res.redirect(`/lecturer/view/saved/courses/${token}`);         
        }
      }); 
  }
  res.render("unAuthorized");
});

//Render Page For Viewing Lecturer's Personal Details
routes.get("/lecturer-login-details/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.user.details._id;
  
  if(token === req.user.token){
    return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/lecturer/${lecturerId}`, {
      headers: {
        "Authorization": `bearer ${token}`
      }
    })
      .then((response) => {
        if(response.data.queryState == "successful"){
          var result = response.data.personalDetails;
          res.locals.pageTitle = "Lecturer\'s Profile";
          return res.render("lecturer/update/updateLecturerProfile", {
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
          if(err.response.data.errorMsg == "Unable To Fetch Lecturer\'s Personal Details"){
            res.locals.pageTitle = "Lecturer\'s Profile";
            req.flash("error_msg", "Unable To Fetch Your Personal Details, Try Again");
            res.redirect(`/lecturer/welcome/${token}`);
          }          
        }
      });
  }
  res.render("unAuthorized");
});

//Confirm Update To Lecturer's Personal Details
routes.post("/confirm-update/:id/:token", ensureLecturerAuthentication, (req, res) => {
  var token = req.params.token;
  var lecturerId = req.params.id;
  
  if(token === req.user.token){
    var updateDetails = {
      id: lecturerId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    }

    return jwt.sign({updateDetails}, "secretKey", {expiresIn: "300000"}, (err, token) => {
      if(err){
        res.locals.pageTitle = "Lecturer Profile";
        res.locals.error_msg_ = "An Error Occured, Try Again";
        return res.render("lecturer/update/updateLecturerProfile", {
          _id: updateDetails.id,
          firstName: updateDetails.firstName,
          lastName: updateDetails.lastName,
          email: updateDetails.email,
          mobileNumber: updateDetails.mobileNumber
        });
      }

      var lecturerDetails = req.user.details;
      var emailDetails = {
        firstName: lecturerDetails.firstName,
        lecturerEmail: lecturerDetails.email,
        loginToken: req.user.token,
        token
      };

      axios.post("https://gtuccrrestapi.herokuapp.com/lecturer/confirm-update", emailDetails, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.emailSent){
            res.locals.pageTitle = "Lecturer Profile";
            res.locals.success_msg_ = "A Confirm Update Link Has Been Sent To Your Email. Click On The Link To Complete The Update";
            return res.render("lecturer/update/updateLecturerProfile", {
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
            res.locals.pageTitle = "Lecturer Profile";
            res.locals.error_msg_ = "An Error Occured, Try Again";
            return res.render("lecturer/update/updateLecturerProfile", {
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
routes.get("/confirm-update/:loginToken/:token", ensureLecturerAuthentication, (req, res) => {
  var loginToken = req.params.loginToken;
  var token = req.params.token;

  if(loginToken === req.user.token){
    return jwt.verify(token, "secretKey", (err, authData) => {
      if(err){
        if(err.name == "TokenExpiredError"){
          res.locals.pageTitle = "Lecturer Profile";
          res.locals.error_msg_ = "Update Link Expired, Re-Update Your Profile";
          return res.render("lecturer/update/updateLecturerProfile", {
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
      axios.put(`https://gtuccrrestapi.herokuapp.com/lecturer/update/lecturer/${updateDetails.id}`, updateDetails, {
        headers: {
          "Authorization": `bearer ${loginToken}`
        }
      })
        .then((response) => {
          if(response.data.LecturerPD){
            var LecturerPD = response.data.LecturerPD;
            res.locals.pageTitle = "Lecturer Profile";
            res.locals.success_msg_ = "Update Successful";
            req.user.details = LecturerPD;
            return res.render("lecturer/update/updateLecturerProfile", {
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
            res.locals.pageTitle = "Lecturer Profile";
            res.locals.error_msg_ = err.response.data.errorMsg;
            res.render("lecturer/update/updateLecturerProfile", {
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