const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


/**********************Uer Registration**********************/
router.post('/register', userController.userRegister);
router.post('/login', userController.loginUser);
router.put('/update/userId/:userId', auth.authentication,  userController.udpdateUser);//auth.authorization,
router.get('/update/userId/:userId', auth.authentication,  userController.getUsers);

module.exports = router;
