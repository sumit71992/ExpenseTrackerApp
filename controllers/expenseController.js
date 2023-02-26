const Expense = require("../models/expenseModel");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');



exports.addExpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const userId = req.user.id;
  
  console.log(userId);
  Expense.create({
    userId,
    amount,
    description,
    category
  })
    .then((result) => {
      console.log("Created Product");
      next();
      // return res.json({result});
    })
    .catch((err) => console.log(err));
    
};
exports.getAllExpenses = (req, res, next) => {
  const isPremium = req.user.isPremium;
  Expense.findAll({where:{userId:req.user.id}})
    .then((expenses) => {
      return res.json({expenses, isPremium});
      })
    .catch((err) => console.log(err));
};

exports.deleteExpense = (req, res, next) => {
  const id = req.params.id;
  Expense.findByPk(id,{where:{userId:req.user.id}})
    .then((expense) => {
      return expense.destroy();
    }).then(result=>{
      console.log("Deleted")
      return res.json({result});
    })
    .catch((err) => console.log(err));
};
exports.getEditExpense = (req, res, next) => {
  const id = req.params.id;
  Expense.findByPk(id)
  .then(expense=>{
    return res.json({expense});
  }).catch(err=>console.log(err));

};
exports.updateExpense = (req, res, next) => {
  const id = req.params.id;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  Expense.findByPk(id)
  .then(expense=>{
    expense.amount=amount;
    expense.description=description;
    expense.category=category;
    return expense.save();
  })
  .then(result=>{
    console.log("Updated");
    return res.json({result});
    
  })
  .catch(err=>console.log(err));
};

exports.getLeaderboard = (req,res)=>{
  const person = User.findAll();
  for(let i=0;i<person.length;i++){
    const all = Expense.findAll({where:{userId:person[i].id}});
    
  }
  
  return res.json(all)
};