const Razorpay = require('razorpay');
const Order = require('../models/orderModel');

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
            req.user.createOrder({orderId:order.id, status:"PENDING"})
            .then(()=>{
                return res.status(201).json({order, key_id:rzp.key_id})
            }).catch(err=>{throw new Error(err)})
        })
    }catch(err){
        console.log(err);
    }
}
const updateStatus = (req,res)=>{
    try{
        const {payment_id, order_id}= req.body;
        Order.findOne({where:{orderId:order_id}}).then(order=>{
            order.update({paymentId: payment_id, status: "SUCCESSFUL"}).then(()=>{
                req.user.update({isPremium: true}).then(()=>{
                    return res.status(202).json({message:"Transaction Successful"});
                }).catch(err=>{
                    throw new Error(err);
                })
            }).catch(err=>{
                throw new Error(err);
            })
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){
        console.log(err);
    }
}
module.exports = {
    premium: premium,
    updateStatus,
};