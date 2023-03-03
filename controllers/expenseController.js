const Expense = require("../models/expenseModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sequelize = require("../util/database");
const AWS = require('aws-sdk');
exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
    await Expense.create(
      {
        userId,
        amount,
        description,
        category,
      },
      { transaction: t }
    );
    const totalExpense = req.user.totalExpenses + Number(amount);
    await User.update(
      {
        totalExpenses: totalExpense,
      },
      { where: { id: userId }, transaction: t }
    );
    await t.commit();
    next();
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
exports.getAllExpenses = async (req, res, next) => {
  try {
    const str = req.query.page;
    const page = Number(str.split("=")[0]);
    const ltd = Number(str.split("=")[1]);

    let count = await Expense.count({ where: { userId: req.user.id } });
    const isPremium = req.user.isPremium;
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * ltd,
      limit: ltd,
    });
    return res.status(200).json({
      expenses,
      isPremium,
      hasNextPage: ltd * page < count,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / ltd),
      currentPage: page
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id, {
      where: { userId: req.user.id },
      transaction: t,
    });
    const usr = await User.findByPk(req.user.id, { transaction: t });
    usr.totalExpenses -= expense.amount;
    await t.commit();
    await usr.save();
    await expense.destroy();
    next();
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
exports.getEditExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);
    return res.json({ expense });
  } catch (err) {
    console.log(err);
  }
};
exports.updateExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const expense = await Expense.findByPk(id, { transaction: t });
    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    await t.commit();
    await expense.save();
    return res.json({ expense });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
exports.getLeaderboard = async (req, res) => {
  try {
    const userLeaderboard = await User.findAll({
      attributes: ["name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
    });
    return res.json({ userLeaderboard });
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${req.user.id}/${Date.now()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);
    return res.status(200).json({ fileURL, message: "Uploaded successfully" })
  } catch (err) {
    console.log(err);
  }
};
const uploadToS3 = async (data, filename) => {
  try {
    const BUCKET_NAME = "skexpense";
    const IAM_USER_KEY = process.env.AWS_USER_KEY;
    const IAM_USER_SECRET = process.env.AWS_SECRET_KEY;
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    })
    let fileDetails = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
      s3bucket.upload(fileDetails, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.Location);
        }
      });
    })
  } catch (err) {
    console.log(err);
    return res.status(402).json({ err, message: "Something went wrong" });
  }
}
