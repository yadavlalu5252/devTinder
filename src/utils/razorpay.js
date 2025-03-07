const Razorpay = require("razorpay");

var instance = new Razorpay({
    // key_id: process.env.RAZORPAY_KEY_ID,
    // key_secret: process.env.RAZORPAY_KEY_SECRET,
    key_id: "rzp_test_vpohMzApOKFdb8",
    key_secret: "5tuhiPPwOfgEhf15UsFBJ3ag"
});

module.exports = instance;