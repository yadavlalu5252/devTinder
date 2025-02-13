const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId","firstName lastName photoUrl age gender about skills");
        res.json({message:"Data fetched Successfully!!",
            data: connectionRequest
        })
    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }
})


userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionsRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id,status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);


        const data = connectionsRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({message: "Connections Fetched Successfully!!!!",
            data
        })
    } catch (error) {
        res.status(400).send("Error: "+error.message);        
    }
})


module.exports = userRouter;