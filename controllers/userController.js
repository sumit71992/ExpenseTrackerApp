const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((signedUser) => {
      if (!signedUser) {
        bcrypt
          .hash(password, 10)
          .then((hashedPwd) => {
            User.create({
              name,
              email,
              password: hashedPwd
            })
              .then((user) => {
                return res.json("sign up successfully");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } else {
        return res.json({ message: "User already signed up" });
      }
    })
    .catch((err) => console.log(err));
};
const authUser = (id,name)=>{
  return jwt.sign({userId: id, userName: name},'hg7fb75ytvhjgety3787v')
}
const signin = async(req, res, next) => {
    try{
        const { email, password } = req.body;
        await User.findOne({ where: { email: email }})
        .then((usr) => {
            if (!usr) {
              return res.status(404).json({ message: "Email not registered" });
            } else {
               bcrypt
                .compare(password, usr.password)
                .then((result) => {
                  // console.log("user",usr)
                  if (!result) {
                    return res.status(401).json({ message: "Password Invalid" });
                  } else {
                    req.user = result;
                   
                    return res.json({ message: "login success", token: authUser(usr.id, usr.name) });
                  }
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
    }
    catch(err){
        return res.status(500).json({message:err});
    }
  
  
    
};
module.exports = {
  signup,
  signin,
};
