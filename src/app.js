const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

// Make your signup API dynamic to receive data from the end user(postman or browser)
app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Created Succussfully!");
  } catch (error) {
    res.status(400).send("bad request!!");
  }
});

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
app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send("User not found");
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
