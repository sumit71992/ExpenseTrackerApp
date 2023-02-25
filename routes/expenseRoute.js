const express = require('express');
const expenseController = require('../controllers/expenseController');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

// appointments => GET
router.get('/', userAuthentication.authenticate, expenseController.getAllExpenses);
router.get('/:id', expenseController.getEditExpense);

// appointments => POST


router.post('/addexpense',userAuthentication.authenticate, expenseController.addExpense, expenseController.getAllExpenses);


//// appointments => PUT
router.put('/:id', userAuthentication.authenticate, expenseController.updateExpense);

// appointments => DELETE
router.delete('/:id',userAuthentication.authenticate, expenseController.deleteExpense);


module.exports = router;
