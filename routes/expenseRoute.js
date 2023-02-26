const express = require('express');
const expenseController = require('../controllers/expenseController');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

// Expense => GET
router.get('/', userAuthentication.authenticate, expenseController.getAllExpenses);
router.get('/:id', expenseController.getEditExpense);
router.get('/leaderboard', userAuthentication.authenticate,expenseController.getLeaderboard);

// Expense => POST


router.post('/addexpense',userAuthentication.authenticate, expenseController.addExpense, expenseController.getAllExpenses);


//// Expense => PUT
router.put('/:id', userAuthentication.authenticate, expenseController.updateExpense);

// Expense => DELETE
router.delete('/:id',userAuthentication.authenticate, expenseController.deleteExpense);


module.exports = router;
