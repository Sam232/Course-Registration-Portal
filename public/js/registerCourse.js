$(document).ready(() => {
  var mobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  $("input:checkbox").on("click", (e) => {
    var checked = $(e.target).is(":checked");

    var registeredCourse;
    var deleteCourse;
    
    if(checked == true){
      registeredCourse = {
        courseCode: e.target.id,
      };
    }
    else{
      registeredCourse = null;
      deleteCourse = e.target.id;
    }

    if(registeredCourse){
      //Register A Student's Course
      return axios.post("https://gtuccr.herokuapp.com/student/add/course/", registeredCourse, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        proxy: {
          host: "https://gtuccr.herokuapp.com/",
          port: 3000
        }
      })
        .then((response) => {
          if(response){           
            if(response.data.addState == "Successful"){
              if(mobile.any()){
                return alert("Course Registered");
              }
              alert("Course Registered");
            }            
          }
        })
        .catch((err) => {
          if(err.response.data.errorMsg){
            if(mobile.any()){
              return alert(err.response.data.errorMsg);
            }
            alert(err.response.data.errorMsg);
          }
        }); 
    }
    if(deleteCourse){
      //Delete A Student's RegisteredCourse
      return axios.delete("https://gtuccr.herokuapp.com/student/delete/course/"+deleteCourse, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        proxy: {
          host: "https://gtuccr.herokuapp.com/",
          port: 3000
        }
      })
        .then((response) => {
          if(response){
            if(response.data.deleteState == "Successful"){
              if(mobile.any()){
                return alert("Course Unregistered");
              }
              alert("Course Unregistered");
            }            
          }
        })
        .catch((err) => {
          if(err.response.data.errorMsg){
            if(mobile.any()){
              return alert(err.response.data.errorMsg);
            }
            alert(err.response.data.errorMsg);
          }
        }); 
    }    
  });
});