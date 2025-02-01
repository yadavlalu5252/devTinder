const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


//middlewares
app.use(express.json());
app.use(cookieParser());


// Make your signup API dynamic to receive data from the end user(postman or browser)
// acts as a middleware and reads the json object coming from req.body and converts it into js object
// app.use(express.json());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {

    // user data
    const { emailId, password } = req.body;

    // database data
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credientials");
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {

      // create jwt token
      const token = await jwt.sign({_id: user._id}, "Lalu@357")
      // console.log(token)

      // add the token to cookie and send the response back to the user
      res.cookie("token", token)
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Credientials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});


// get profile
app.get("/profile", async(req, res) => {
 try {
  const cookies = req.cookies;
  const {token} = cookies;
  if(!token){
    throw new Error("Invalid Token!")
  }

  //validate user
  const decodedMessage = await jwt.verify(token, "Lalu@357");
  const {_id} = decodedMessage;
  // console.log("id is: "+_id);
  const user = await User.findById(_id);

  if(!user){
    throw new Error("User not found!")
  }
  res.send(user);  
 }
  catch (error) {
  // throw new Error("Error while fetching Profile: "+ error.message)
  /* agar uper jaisa krenge to terminal pe error aayega */
  res.status(400).send("Error: "+error.message)
 }

})




// get a user
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("something went Wrong!!");
  }
});

// get a user by id
app.get("/user1", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(404).send("User not found in database");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(501).send("Unauthorized User");
  }
});

// get a feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong!!");
  }
});

// Delete a user API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete(userId);
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user Deleted Succussfully");
  } catch (error) {
    res.status(400).send("User not found!");
  }
});

// Update data of the user
// Api level validation
app.patch("/user/:_id", async (req, res) => {
  const userId = req.params?._id;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpadateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpadateAllowed) {
      throw new Error("Update not Allowed!");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("user updated succussfully!");
  } catch (error) {
    res.status(400).send("Update FAILED: " + error.message);
  }
});

// DB connection
connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(3000, () => {
      console.log("app listen at 3000...");
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
