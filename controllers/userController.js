const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database')

const signup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password } = req.body;
    const signedUser = await User.findOne({ where: { email: email }, transaction: t });
    if (!signedUser) {
      const hashedPwd = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPwd
      }, { transaction: t });
      await t.commit();
      return res.json("sign up successfully");
    } else {
      await t.rollback();
      return res.json({ message: "User already signed up" });
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
const authUser = (id, name) => {
  return jwt.sign({ userId: id, userName: name }, 'hg7fb75ytvhjgety3787v')
}
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usr = await User.findOne({ where: { email: email } });
    if (!usr) {
      return res.status(404).json({ message: "Email not registered" });
    } else {
      const result = await bcrypt.compare(password, usr.password);
      if (!result) {
        return res.status(401).json({ message: "Password Invalid" });
      } else {
        return res.json({ message: "login success", token: authUser(usr.id, usr.name) });
      }
    }
  }
  catch (err) {
    return res.status(500).json({ message: err });
  }



};
module.exports = {
  signup,
  signin,
};
