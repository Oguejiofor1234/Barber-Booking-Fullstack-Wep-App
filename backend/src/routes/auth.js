const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, getBarbers } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
];

router.post('/register', registerValidation, register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/barbers', getBarbers);

module.exports = router;
