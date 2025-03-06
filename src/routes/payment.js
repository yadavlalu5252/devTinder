const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const {membershipAmount} = require("../utils/constants");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");


paymentRouter.post("/payment/create", userAuth, async(req,res)=> {
    try {
        const {membershipType} = req.body;
        const {firstName, lastName, emailId} = req.user; // userAuth
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType]*100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType
            }
        })


        // save it in db
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        })


        const savedPayment = await payment.save();
        // return back my order details to frontend
        res.json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID})

    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
});

paymentRouter.post("/payment/webhook", async(req, res) => {
    try {
        const webhookSignature = req.get["X-Razorpay-Signature"];
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        // If unwanted webhook comes then not valid
        if(!isWebhookValid){
            return res.status(400).json({msg: "Webhook signature is invalid"})
        }

        // Update my payment Status in DB
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status;
        payment.save();

        const user = await User.findOne({_id: payment.userId});
        user.isPremium = true,
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // return success response to rezorpay
        return res.status(200).json({msg: "Webhook received successfully!"})


    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
})




module.exports = paymentRouter;