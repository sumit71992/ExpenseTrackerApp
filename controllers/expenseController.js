const Expense = require("../models/expenseModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sequelize = require("../util/database");

exports.addExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
    const expense = await Expense.create({
      userId,
      amount,
      description,
      category,
    });
    const user = await User.findByPk(userId);
    user.totalExpenses += Number(amount)
    await user.save();
    next();
  } catch (err) {
    console.log(err);
  }
};
exports.getAllExpenses = (req, res, next) => {
  const isPremium = req.user.isPremium;
  Expense.findAll({ where: { userId: req.user.id } })
    .then((expenses) => {
      return res.json({ expenses, isPremium });
    })
    .catch((err) => console.log(err));
};

exports.deleteExpense = (req, res, next) => {
  const id = req.params.id;
  Expense.findByPk(id, { where: { userId: req.user.id } })
    .then((expense) => {
      return expense.destroy();
    })
    .then((result) => {
      console.log("Deleted");
      return res.json({ result });
    })
    .catch((err) => console.log(err));
};
exports.getEditExpense = (req, res, next) => {
  const id = req.params.id;
  Expense.findByPk(id)
    .then((expense) => {
      return res.json({ expense });
    })
    .catch((err) => console.log(err));
};
exports.updateExpense = (req, res, next) => {
  const id = req.params.id;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  Expense.findByPk(id)
    .then((expense) => {
      expense.amount = amount;
      expense.description = description;
      expense.category = category;
      return expense.save();
    })
    .then((result) => {
      console.log("Updated");
      return res.json({ result });
    })
    .catch((err) => console.log(err));
};
exports.getLeaderboard = async (req, res) => {
  try {
    const userLeaderboard = await User.findAll({
      attributes: ["name","totalExpenses"],
      order: [['totalExpenses', "DESC"]]
    });
    return res.json({ userLeaderboard });
  } catch (err) {
    console.log(err);
  }
};
