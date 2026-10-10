import express from 'express'
import { createTodo } from './todo.js'
import { registerUser, loginUser } from './auth.js'

const router = express.Router()

router.post('/todo', createTodo)
router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)

export {
    router
}