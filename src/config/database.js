const mongoose = require("mongoose");
const connectDB = async () => {
   await mongoose.connect(
      "mongodb+srv://yadavlalu5252:lalu123@devtinder.can9r.mongodb.net/devTinder"
   );
}

module.exports = connectDB;