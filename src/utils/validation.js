const validator = require("validator");
const User = require("../models/user");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter Strong password!!");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
         "firstName", 
         "lastName",
         "age",
         "skills",
          "photoUrl",
          "gender",
          "emailId",
          "about"
        ]
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

// const validatePassword = async(req) => {
//     const {password} = req.body;
//     const user = await User.findOne({ emailId: emailId });


// }

module.exports = {
    validateSignUpData,
    validateEditProfileData
}