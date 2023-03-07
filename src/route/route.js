const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


/**********************Uer Registration**********************/
router.post('/register', userController.userRegister);
router.post('/login', userController.loginUser);
router.put('/update/userId/:userId', userController.udpdateUser);
router.get('/update/userId/:userId', userController.getUsers);

module.exports = router;
