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
        return res.json({ message: "User already signed up" });
      }
    })
    .catch((err) => console.log(err));
};

const signin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((usr) => {
      if (!usr) {
        return res.json({ message: "Email not registered" });
      } else if (usr.password === password) {
        console.log("success");
        return res.json({ message: "login success" });
      } else {
        console.log("Invalid");
        return res.json({ message: "Password Invalid" });
      }
    })
    .catch((err) => console.log(err));
};
module.exports = {
  signup,
  signin,
};
