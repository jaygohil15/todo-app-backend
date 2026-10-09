import { registerUserQuery } from '../db/queries.js'
import { query } from '../db/index.js'
import { genSalt, hash } from 'bcrypt'

const SALT_ROUNDS = 10

const registerUser = async (req, res) => {
    try {
        console.log('/auth/register Start')
        const {
            username = '',
            first_name = '',
            email = '',
            password = '',
        } = req.body

        let errMsg
        if (username.length <= 3) {
            errMsg = 'username must be greater than 3 characters'
        }
        if (first_name.length <= 3) {
            errMsg = 'first_name must be greater than 3 characters'
        }
        if (email.length === 0) {
            errMsg = 'email can not be empty'
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            errMsg = 'Please provide valid email address'
        }
        if (password.length === 0) {
            errMsg = 'password can not be empty'
        }
        if (errMsg) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: errMsg
            })
        }

        const salt = await genSalt(SALT_ROUNDS)
        const hashedPassword = await hash(password, salt)

        const queryText = registerUserQuery(username, first_name, email, hashedPassword)
        const result = await query(queryText)

        console.log('result', result)

        if (result.rows[0].username) {
            res.status(200).json({
                status: 'success',
                statusCode: 201,
                message: `${result.rows[0].username} registered successfully!`
            })
        } else {
            throw new Error('Something went wrong')
        }
        console.log('/auth/register End')

    } catch (err) {
        console.log('Error in /auth/register api', err)
        let message = 'something went wrong'

        // Error Code for violation of duplicate key
        if (err.code === '23505') {
            if (err.detail.includes('username')) {
                message = 'username already exists'
            }
            if (err.detail.includes('email')) {
                message = 'email already exists'
            }
            res.status(409).json({
                status: 'error',
                statusCode: 409,
                message
            })
        } else {
            res.status(400).json({
                status: 'error',
                statusCode: 400,
                message
            })
        }

    }
}

export {
    registerUser
}