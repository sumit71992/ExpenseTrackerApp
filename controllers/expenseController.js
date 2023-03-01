const Expense = require("../models/expenseModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sequelize = require("../util/database");

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
    const page = +req.query.page || 1;
    console.log(">>>>>>>>>>>>>>>>>>>>>>",page);
    let count = await Expense.count({ where: { userId: req.user.id } });
    const isPremium = req.user.isPremium;
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * 10,
      limit: 10,
    });
    return res.status(200).json({
      expenses,
      isPremium,
      hasNextPage: 10*page<count,
      nextPage:page+1,
      hasPreviousPage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(count/10),
      currentPage:page
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
