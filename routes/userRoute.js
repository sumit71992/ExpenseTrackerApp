const express = require('express');
const userController = require('../controllers/userController');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin',userController.signin,expenseController.getAllExpenses);
router.post('/forgotpassword',userController.forgotPassword);

module.exports = router;
