const User = require("../models/userModel");
const Forgot = require("../models/forgotPasswordModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const signup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password } = req.body;
    const signedUser = await User.findOne({
      where: { email: email },
      transaction: t,
    });
    if (!signedUser) {
      const hashedPwd = await bcrypt.hash(password, 10);
      await User.create(
        {
          name,
          email,
          password: hashedPwd,
        },
        { transaction: t }
      );
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
  return jwt.sign({ userId: id, userName: name }, "hg7fb75ytvhjgety3787v");
};
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
        return res.json({
          message: "login success",
          token: authUser(usr.id, usr.name),
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const forgotPassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const email = req.body.email;
    const userid = await User.findOne({ where: { email: email } });
    if (userid) {
      const uuid = uuidv4();
      const url = "http://localhost:3000/password/resetpassword/" + uuid;
      const client = Sib.ApiClient.instance;
      var apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.EMAIL_API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "thatanjan@gmail.com",
        name: "Anjan",
      };
      const receivers = [
        {
          email: email,
        },
      ];
      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Reset password Link",
        htmlContent: `<a href=${url}>click here to reset password</a>`,
      });
      await Forgot.create(
        {
          id: uuid,
          userId: userid.id,
          isActive: true,
        },
        { transaction: t }
      );
      await t.commit();
      return res.json({ message: "Success" });
    } else {
      return res.json({ message: "Email id not registered" });
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.json(err);
  }
};
const resetPassword = async (req, res) => {
  const t = await sequelize.transaction();
  try{
    const uuid = req.params.id;
    const reset = await Forgot.findByPk(uuid,{transaction:t});
    if(reset.isActive===true){
      await Forgot.update({
        isActive:false
      },{where:{id:uuid},transaction:t})
      await t.commit();
      return res.json({message:"Success"})
    }else{
      return res.json({message:"Link Expired"});
    } 
  }catch(err){
    await t.rollback();
    console.log(err);
    return res.json(err)
  }
};
module.exports = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
};
