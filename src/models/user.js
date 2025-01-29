const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email Address: "+ value);
        }
      }
    },

    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter Strong Password: "+ value)
        }
      }
    },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      }
    },

    about: {
      type: String,
      default: "This is about me",
    },

    skills: {
      type: [String],
    },

    photoUrl: {
      type: String,
      validate(value){
        if(!validator.isURL(value)){
          throw new Error("Your Photo Url is not Correct"+ value)
        }
      }
    }
  },
  
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
