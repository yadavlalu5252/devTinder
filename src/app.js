const express = require("express");
const app = express();
const connectDB = require("./config/database");
require('dotenv').config()

const cookieParser = require("cookie-parser");


//middlewares
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);






// DB connection
connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(process.env.PORT, () => {
      console.log("app listen at 7777...");
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
