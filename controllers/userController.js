const User = require('../models/userModel');

const signup = (req, res, next)=>{
    const {name,email,password} = req.body;
    console.log(name,email,password)
    User.create({
        name,
        email,
        password
    }).then(user=>{
        return res.json("sign up successfully");
    }).catch(err=>console.log(err))
    
}
module.exports={
signup,
}