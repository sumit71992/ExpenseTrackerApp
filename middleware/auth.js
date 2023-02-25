const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = (req,res,next)=>{
    try{
      const token = req.header('Authorization');
      const user = jwt.verify(token,'hg7fb75ytvhjgety3787v');
      User.findByPk(user.userId)
      .then(usr=>{
        req.user = usr;
        next();
      })
    }catch(err){
      console.log(err);
      return res.status(401).json({message:false});
    };
  }
  module.exports= {
    authenticate
  }