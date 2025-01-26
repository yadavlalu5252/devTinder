console.log("waving from dev tinder");

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

app.use("/user", (req,res) => {
  res.send("I am the king")
})

app.post("/user", (req, res) => {
  res.send("app is sending post request");
});

app.get("/user", (req, res) => {
  res.send({firstName: "lalu", lastName: "yadav"});
});

app.delete("/user", (req, res) => {
  res.send("deleted succussfully!!");
});

app.listen(3000, () => {
  console.log("app listen at 3000...");
});
