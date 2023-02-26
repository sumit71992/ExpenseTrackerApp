const Razorpay = require('razorpay');
const Order = require('../models/orderModel');
require('dotenv').config();

const premium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 5000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId: order.id, status: "PENDING" })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                }).catch(err => { throw new Error(err) })
        })
    } catch (err) {
        console.log(err);
    }
}
const updateStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const reason = req.body.reason
        if (reason == "payment_failed") {
            const order = await Order.findOne({ where: { orderId: order_id } });
            await order.update({ paymentId: payment_id, status: "FAILED" });
            console.log("failed payment")
            return res.status(202).json({ message: "Transaction Failed" });
        }

        const order = await Order.findOne({ where: { orderId: order_id } });
        await order.update({ paymentId: payment_id, status: "SUCCESSFUL" });
        await req.user.update({ isPremium: true });
        return res.status(202).json({ message: "Transaction Successful" });

    } catch (err) {
        console.log("err", err);
        return res.status(403).json({ error: err, message: "Something went wrong" });
    }
}
module.exports = {
    premium: premium,
    updateStatus,
};