const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validatePasswordMiddleware = require('../middlewares/validatePassword');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', validatePasswordMiddleware, authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
