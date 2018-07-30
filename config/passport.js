const LocalStrategy = require("passport-local").Strategy;
const axios = require("axios");

module.exports = {
  passport: (passport) => {
    passport.use("local-student", new LocalStrategy({usernameField: "indexNumber"}, (indexNumber, password, done) => {
      axios.post("https://gtuccrrestapi.herokuapp.com/login/", {
        indexNumber,
        password
      })
        .then((studentDetails) => {
          if(studentDetails){
            return done(null, studentDetails.data.user);
          }
        })
        .catch((err) => {
          if(err.response.data.authState == "unsuccessful"){
            return done(null, false, {message: "Incorrect Login Credentials Provided"});
          }
          if(err.response.data.errorMsg == "An Error Occured, Try Again"){
            return done(null, false, {message: "An Error Occured, Try Again"});
          }
          done(null, false, {message: "An Error Occured, Try Again"});
        });
    }));

    passport.use("local-user", new LocalStrategy({usernameField: "email"}, (email, password, done) => {
      var linkId = password;
      axios.post(`https://gtuccrrestapi.herokuapp.com/login/${linkId}`, {
        email
      })
        .then((userDetails) => {
          if(userDetails){
            return done(null, userDetails.data.user, {message: "Your Login Link Has Been Sent To Your Email"});
          }
        })
        .catch((err) => {
          if(err.response.data.authState == "unsuccessful"){
            return done(null, false, {message: "Incorrect Login Credential Provided"});
          }
          if(err.response.data.errorMsg == "An Error Occured, Try Again"){
            return done(null, false, {message: "An Error Occured, Try Again"});
          }
          return done(null, false, {message: "An Error Occured, Try Again"});
        });
    }));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((req, user, done) => {
      // if(req.body.rememberMe == "on"){    
      // }
      
      done(null, user);
    });
  }
}