const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")



// send connection request
requestRouter.get("/sendConnectionRequest", userAuth, async(req, res) => {
    try {
      const user = req.user;
      res.send(user.firstName+" has sent a connection request!")
    } catch (error) {
          res.status(400).send("Invalid request!!"+ error.message)
    }
  })
module.exports = requestRouter;