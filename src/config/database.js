const mongoose = require("mongoose");
const connectDB = async () => {
   await mongoose.connect(process.env.MONGODB_SECRET_KEY)

}

module.exports = connectDB;