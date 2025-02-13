const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values:["interested","ignored","accepted", "rejected"],
            message: `{VALUE} is incorrect status type `,
        },
    },
},
{timestamps: true}
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;

    // check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw next(new Error("Cannot Send connection Request to yourself!!"));
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;