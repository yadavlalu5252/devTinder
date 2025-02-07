// const adminAuth = (req, res, next) => {
//         console.log("Admin is checking here...")
//         const token = "xyz";
//         const isAdminAuthorized = (token === "xyz");
//         if(!isAdminAuthorized){
//           res.status(401).send("unAuthorized")
//         }else {
//           next();
//         }
//       }


const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next) => {
  try {
    const {token} = req.cookies;
    if(!token){
      throw new Error("Token not Found!!!")
    };

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const {_id} = decodedObj;
    const user = await User.findById(_id);

    if(!user){
      throw new Error("User not Found!!");
    }
    req.user = user; // user attach here so dont need to fetch again and again
    next();

  } catch (error) {
    res.status(400).send("Error: "+error.message)
  }
}

module.exports = {
    // adminAuth
    userAuth
}