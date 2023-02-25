const express = require('express');
const userController = require('../controllers/userController');
const expenseController = require('../controllers/expenseController');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

// appointments => GET
router.get('/', userAuthentication.authenticate, expenseController.getAllExpenses);
router.get('/:id', expenseController.getEditExpense);

// appointments => POST
router.post('/signup', userController.signup);
router.post('/signin',userController.signin,expenseController.getAllExpenses)
router.post('/expense',userAuthentication.authenticate, expenseController.addExpense, expenseController.getAllExpenses);


//// appointments => PUT
router.put('/:id', userAuthentication.authenticate, expenseController.updateExpense);

// appointments => DELETE
router.delete('/:id',userAuthentication.authenticate, expenseController.deleteExpense);


module.exports = router;
