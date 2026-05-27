import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.js';

const router = Router();

// REGISTER VALIDATION RULES 

const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// LOGIN VALIDATION RULES
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ROUTES
// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

export default router;