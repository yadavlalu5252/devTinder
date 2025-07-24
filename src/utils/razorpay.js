const Razorpay = require("razorpay");

var instance = new Razorpay({
    // key_id: process.env.RAZORPAY_KEY_ID,
    // key_secret: process.env.RAZORPAY_KEY_SECRET,
    key_id: "rzp_test_0SIRLysIPH80zC",
    key_secret: "ayXJVeLRcN3MUS7ZwjjBTphk"
});

module.exports = instance;