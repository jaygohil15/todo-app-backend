import express from 'express'
import { createTodo } from './todo.js'
import { registerUser } from './auth.js'

const router = express.Router()

router.post('/todo', createTodo)
router.post('/auth/register', registerUser)

export {
    router
}