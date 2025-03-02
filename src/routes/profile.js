const express = require("express");
const profileRouter = express.Router();


const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");


// get profile => view profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user)
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  });


  // edit profile
  profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
      if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request")
      }

      const loggedInUser = req.user;

      // loggedInUser.firstName = req.body.firstName;
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

      await loggedInUser.save();
      
      res.json({
        message: `${loggedInUser.firstName}, your profile updated successfuly`,
        data: loggedInUser,
      });
      
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  })

  // update password ==> created by me
  profileRouter.patch("/profile/password", userAuth, async(req, res) => {
    try {
      const user = req.user;
      const isValidPassword = await user.validatePassword(password);
      if(!isValidPassword){
        throw new Error("You entered Password is incorrect!")
      }
      
      user.password = req.body.password;
      await user.save();
      res.send("password updated Succussfully!")

    } catch (error) {
      res.status(400).send("Error: "+ error.message);
    }
  })

  
module.exports = profileRouter;