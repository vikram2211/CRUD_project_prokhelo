const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


/**********************Uer Registration**********************/
router.post('/register', userController.userRegister);
router.post('/login', userController.loginUser);
router.put('/update/userId/:userId', auth.authentication, auth.authorization, userController.udpdateUser);
router.get('/update/userId/:userId', auth.authentication, auth.authorization, userController.getUsers);

module.exports = router;
