const express = require('express');
const { login, signup, verifyToken } = require('../controllers/authController');
const { verifyToken: verifyTokenMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/verify-token', verifyTokenMiddleware, verifyToken);

module.exports = router;