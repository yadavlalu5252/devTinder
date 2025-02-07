const express = require("express");
const app = express();

// Order of route matter the most

// app.use("/",(req, res) => {
//     res.send("Hello from server")
// })

// app.use("/test", (req, res) => {
//     res.send("app is in testing phase")
// })

// app.use("/hello", (req, res) => {
//     res.send("app is saying ki hal chal hello ji!!")
// })

// app.use("/hello/2", (req, res) => {
//     res.send("hello hello hello");
//     // if we run route /hello/2 then also /hello will run
// })

// app.use("/user", (req,res) => {
//   res.send("I am the king")
// })

// app.post("/user", (req, res) => {
//   res.send("app is sending post request");
// });

// app.delete("/user", (req, res) => {
//   res.send("deleted succussfully!!");
// });

// app.get("/ab+c", (req, res) => {
//   res.send("We are experimenting!! ")
// })

// Dynamic Routing -- params
app.get("/user/:userId/:username", (req, res) => {
  console.log(req.params);
  const { userId, username } = req.params;
  console.log(userId);
  console.log(username);
  res.send("hii");
});

// Query parameters
app.get("/user", (req, res) => {
  console.log(req.query);
  const name = req.query.name;
  const lastnnmae = req.query.lastName;
  console.log(`name is ${name} and lastname is ${lastnnmae} `);
  res.send({ firstName: "lalu", lastName: "yadav" });
});

// We can have a multiple request handler inside route
app.use(
  "/user",
  (req, res, next) => {
    console.log("1st response");
    // res.send("Handling the route user 1");
    next();
  },
  (req, res, next) => {
    console.log("2nd Response");
    res.send("second Resposne");
    // next();
  }
);

app.listen(3000, () => {
  console.log("app listen at 3000...");
});

/* Handle Auth middleware for all GET, POST, DELETE... request */
const { adminAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  console.log("first");
  res.send("All data fetched Succussfully!");
});

app.get("/admin/deleteAllData", (req, res) => {
  res.send("Deleted Succussfully");
});

// Error handling
app.get("/admin/getAllData", (req, res) => {
  throw new Error("tujhe error aaya hai! handle kr");
  res.send("All data fetched Succussfully!");
});
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

// data creation
app.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "Lalu",
  //   lastName: "Yadav",
  //   email: "yadavlalu5252@gmail.com",
  //   password: "Lalu@357",
  //   age: "25",
  //   gender: "male"
  // }
  const user = new User({
    firstName: "Hitesh",
    lastName: "Panchal",
    email: "hiteshpanchal357@gmail.com",
    password: "Hitesh@357",
    age: "26",
    gender: "male",
  });
  try {
    user.save();
    res.send("User Created Succussfully!");
  } catch (error) {
    res.status(400).send("bad request!!");
  }
});

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

  // get a feed

  app.get("/feed", async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      res.status(400).send("something went wrong!!");
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

// DB connection and app listen
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
