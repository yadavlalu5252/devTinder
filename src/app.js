const express = require("express");
const app = express();


// We can have a multiple request handler inside route
// app.use("/user", 
//   (req, res, next) => {
//     console.log("1st response");
//     // res.send("Handling the route user 1");
//     next();
// },
// (req, res, next) => {
//   console.log("2nd Response")
//   res.send("second Resposne")
//   // next();
// }
// )

// app.use("/user", [rh1, rh2], rh3, rh4)
// we can add in arrays of request handlers

// we can write separate route handler also of same name
/* app.use("/user", (req, res, next) => {
  console.log("First request handler")
  res.send("I am first");
  // next();
})

app.use("/user", (req, res, next) => {
  console.log("second request handler")
  res.send("I am second");
}) */


  /* Handle Auth middleware for all GET, POST, DELETE... request */
 /*  const {adminAuth} = require("./middlewares/auth")
  app.use("/admin", adminAuth);

  app.get("/admin/getAllData", (req,res) => {
    console.log("first");
    res.send("All data fetched Succussfully!");
  })

  app.get("/admin/deleteAllData", (req, res) => {
    res.send("Deleted Succussfully")
  })
 */



  // Error handling
/*   app.get("/admin/getAllData", (req,res) => {

    throw new Error("tujhe error aaya hai! handle kr")
    res.send("All data fetched Succussfully!");
  })
  app.use("/", (err, req, res, next) => {
    if(err){
      res.status(500).send("something went wrong")
    }
  }) */

app.listen(3000, () => {
  console.log("app listen at 3000...");
});
