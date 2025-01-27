const express = require("express");
const app = express();
const connectDB = require('./config/database')






connectDB().then(() => {
  console.log("Database Connection Established...")
  app.listen(3000, () => {
    console.log("app listen at 3000...");
  });
}).catch(err => {
console.log("Database connection failed")
})

