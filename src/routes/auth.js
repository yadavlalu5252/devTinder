const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    // Encrpt the password
    const { emailId, password, firstName, lastName, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
    });
    await user.save();
    res.send("User Created Succussfully!");
  } catch (error) {
    res.status(400).send("User not Created: " + error.message);
  }
});


//login a user
authRouter.post("/login", async (req, res) => {
  try {
    // user data
    const { emailId, password } = req.body;

    // database data
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credientials");
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 36000),
      });
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Credientials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// logout
authRouter.post("/logout", async(req, res) => {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
      });
      res.send("logout Successful!");

})


module.exports = authRouter;
