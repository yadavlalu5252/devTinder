

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
  console.log(req.params)
  const {userId, username} = req.params;
  console.log(userId)
  console.log(username)
  res.send("hii")
})

// Query parameters
app.get("/user", (req, res) => {
  console.log(req.query)
  const name = req.query.name;
  const lastnnmae = req.query.lastName;
  console.log(`name is ${name} and lastname is ${lastnnmae} `)
  res.send({firstName: "lalu", lastName: "yadav"});
});

// We can have a multiple request handler inside route
app.use("/user", 
  (req, res, next) => {
    console.log("1st response");
    // res.send("Handling the route user 1");
    next();
},
(req, res, next) => {
  console.log("2nd Response")
  res.send("second Resposne")
  // next();
}
)


app.listen(3000, () => {
  console.log("app listen at 3000...");
});


/* Handle Auth middleware for all GET, POST, DELETE... request */
const {adminAuth} = require("./middlewares/auth")
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req,res) => {
  console.log("first");
  res.send("All data fetched Succussfully!");
})

app.get("/admin/deleteAllData", (req, res) => {
  res.send("Deleted Succussfully")
})

  // Error handling
  app.get("/admin/getAllData", (req,res) => {

    throw new Error("tujhe error aaya hai! handle kr")
    res.send("All data fetched Succussfully!");
  })
  app.use("/", (err, req, res, next) => {
    if(err){
      res.status(500).send("something went wrong")
    }
  })