const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills isPremium";

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


userRouter.get("/feed", userAuth, async(req, res) => {
    try {
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1)*limit;

        /* User should get all the user except
        1. his own card
        2. his connections
        3. ignored people
        4. already sent the connection request
        */
       
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}]
            // connection between a to b or b to a
        }).select("fromUserId toUserId")
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName");


        // block all the connection requests are present
        const hideUserFromFeed = new Set(); // use set ds because duplicate value na aaye
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
             // connection req ke fromUserId and toUserId ko set ds mai add kr denge
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUserFromFeed)}}, // find all user who not present in
                {_id: {$ne: loggedInUser._id}}, // not want my own card also
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        // console.log("users data is: ", users);
        res.json({ data: users });

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})


module.exports = userRouter;