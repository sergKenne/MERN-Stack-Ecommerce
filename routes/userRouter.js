const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');

router.post('/register', userCtrl.register);

router.get('/refresh_token', userCtrl.refreshToken);

//router.get('/register', userCtrl.getUsers)


module.exports = router;