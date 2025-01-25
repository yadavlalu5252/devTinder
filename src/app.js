console.log("waving from dev tinder");

const express = require("express");
const app = express();

// app.use("/",(req, res) => {
//     res.send("Hello from server")
// })
app.use("/test", (req, res) => {
    res.send("app is in testing phase")
})

app.use("/hello", (req, res) => {
    res.send("app is saying ki hal chal hello ji!!")
})

app.listen(3000, () => {
    console.log("app listen at 3000...");
})