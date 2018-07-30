module.exports = {
  showFullName: (userDetails) => {
    if(userDetails){
      var fullName = userDetails.firstName+" "+userDetails.lastName;
      return fullName;
    }
  },
  showYear: () => {
    return new Date().getFullYear();
  }
}