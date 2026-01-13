const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      unique: true,
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
    
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      // enum: {
      //   value: ["male","female","others"],
      //   message: `{VALUE} is invalid genger type.`
      // },

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
      default: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png",
      validate(value){
        if(!validator.isURL(value)){
          throw new Error("Your Photo Url is not Correct"+ value)
        }
      }
    },
  },
  
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({_id: user._id}, "Lalu@357",{
    expiresIn: "7d"
  });
  return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isValidPassword = await bcrypt.compare(passwordInputByUser, user.password)
  return isValidPassword;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
