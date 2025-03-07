const express = require("express");
const app = express();
const connectDB = require("./config/database");
require("dotenv").config()

const cors = require("cors");
app.use(cors({
  origin:"http://localhost:5173", // whitelisting this network 
  credentials: true
}));

const cookieParser = require("cookie-parser");


//middlewares
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter)


// DB connection
connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(7777, () => {
      console.log("app listen at 7777...");
    });
  })
  .catch((err) => {
    console.log("Database connection failed"+err.message);
  });
