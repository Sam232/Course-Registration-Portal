const axios = require("axios");

module.exports = {
  ensureAdminAuthentication: (req, res, next) => {
    if(req.isAuthenticated()){
      return axios.get(`https://gtuccrrestapi.herokuapp.com/admin/view/admin/${req.user.details._id}`, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.queryState == "successful"){
            return next();
          }
          res.render("notFound");
        })
        .catch((err) => {
          if(err){
            res.render("errorOccured");          
          }
        });
    }
    res.render("unAuthorized");
  },
  ensureLecturerAuthentication: (req, res, next) => {
    if(req.isAuthenticated()){
      return axios.get(`https://gtuccrrestapi.herokuapp.com/lecturer/view/lecturer/${req.user.details._id}`, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.queryState == "successful"){
            return next();
          }
          res.render("notFound");
        })
        .catch((err) => {
          if(err){
            res.render("errorOccured");          
          }
        });
    }
    res.render("unAuthorized");
  },
  ensureFinanceAuthentication: (req, res, next) => {
    if(req.isAuthenticated()){
      return axios.get(`https://gtuccrrestapi.herokuapp.com/finance/view/finance/${req.user.details._id}`, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.queryState == "successful"){
            return next();
          }
          res.render("notFound");
        })
        .catch((err) => {
          if(err){
            res.render("errorOccured");          
          }
        });
    }
    res.render("unAuthorized");
  },
  ensureStudentAuthentication: (req, res, next) => {
    if(req.isAuthenticated()){
      return axios.get(`https://gtuccrrestapi.herokuapp.com/student/view/student/${req.user.details._id}`, {
        headers: {
          "Authorization": `bearer ${req.user.token}`
        }
      })
        .then((response) => {
          if(response.data.queryState == "successful"){
            return next();
          }
          res.render("notFound");
        })
        .catch((err) => {
          if(err){
            res.render("errorOccured");          
          }
        });
    }
    res.render("unAuthorized");
  }
};