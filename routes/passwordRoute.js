const express = require('express');
const userController = require('../controllers/userController');
const userAuthentication = require('../middleware/auth');
const router = express.Router();


router.post('/forgotpassword',userController.forgotPassword);
router.post('/resetpassword/:id',userController.resetPassword);

module.exports = router;