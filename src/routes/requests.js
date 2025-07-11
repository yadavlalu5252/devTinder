const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");





// send connection request used for both interested as well as ignored in place of status

requestRouter.post("/request/sent/:status/:toUserId", userAuth, async(req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      
      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status)){
          return res.status(400).json({
            message:"Invalid status type: "+ status})
      }

      // check whether req coming is it in database or not
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(400).json({
          message: "User not Exist in Database"
        })
      }

      // check whether same user sending req to own
      // if(fromUserId.equals(toUserId)){
      //   return res.status(400).json({
      //     message: "You are sending request to yourself, That is not Allowed!"
      //   })
      // }

      //check the existing connection request => dono mai se koi bhi ek
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {fromUserId, toUserId}, // lalu to hitesh
          {fromUserId: toUserId, toUserId: fromUserId}, // hitesh to lalu
        ]
      });
      if(existingConnectionRequest){
        return res.status(400).send({message: "Connection Request Already Exists!!"});
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })

      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} has ${status} in ${toUser.firstName} `,
        data: data
      })

    } catch (error) {
          res.status(400).send("Invalid request!! "+ error.message)
    }
  })

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try {
      const loggedInUser = req.user;
      const {status, requestId} = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "Status not allowed!"});
      }

      // _id: is request id we will pass and remaining two condition is true then and only then this will find and connection request

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id, // hitesh
        status: "interested",
      });
      console.log(connectionRequest, requestId);
      if(!connectionRequest){
        return res.status(404).json({message: "Connection Request Not Found!!"});
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({message: "User Accepted/Rejected the Request!!",
        data: data
      })



    } catch (error) {
      res.status(400).send("Invalid request! "+error.message);
    }
  })



module.exports = requestRouter;