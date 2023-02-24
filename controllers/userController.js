const User = require("../models/userModel");

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((signedUser) => {
      if (!signedUser) {
        User.create({
          name,
          email,
          password,
        })
          .then((user) => {
            return res.json("sign up successfully");
          })
          .catch((err) => console.log(err));
      } else {
        return res.json({message:"User already signed up"})
      }
    })
    .catch((err) => console.log(err));
};
module.exports = {
  signup,
};
