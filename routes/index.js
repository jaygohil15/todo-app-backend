import express from 'express'
import rateLimit from "express-rate-limit";

import { createTodo } from './todo.js'
import { registerUser, loginUser } from './auth.js'

// Rate limit for the login endpoint
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 1, // Limit each IP to 5 login requests per window
  message: {
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
});

const router = express.Router()

router.post('/todo', createTodo)
router.post('/auth/register', registerUser)
router.post('/auth/login', loginLimiter, loginUser)

export {
    router
}