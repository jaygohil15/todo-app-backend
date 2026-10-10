import { registerUserQuery, getPasswordHashWithUsername, getPasswordHashWithEmail } from '../db/queries.js'
import { query } from '../db/index.js'
import { compare, genSalt, hash } from 'bcrypt'

const SALT_ROUNDS = 10
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const registerUser = async (req, res) => {
    try {
        console.log('/auth/register start')
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
        if (first_name.length <= 0) {
            errMsg = 'first_name must be greater than 0 characters'
        }
        if (!emailRegex.test(email)) {
            errMsg = 'Please provide valid email address'
        }

        if (password.length === 0) {
            errMsg = 'password can not be empty'
        }
        if (errMsg) {
            console.log(`/auth/register Validation Error: ${errMsg}`)
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
        console.log('/auth/register end')

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

const loginUser = async (req, res) => {
    try {
        console.log('/auth/login start')
        const {
            username = '',
            email = '',
            password = '',
        } = req.body

        let errMsg = ''
        if (!username && !emailRegex.test(email)) {
            errMsg = 'Email address or username cannot be empty'
        }
        if (!password) {
            errMsg = 'Password cannot be empty'
        }

        if (errMsg) {
            console.log(`/auth/login Validation Error: ${errMsg}`)
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: errMsg
            })
        }

        let result

        if (username) {
            const queryText = getPasswordHashWithUsername(username)
            result = await query(queryText)
        } else if (email) {
            const queryText = getPasswordHashWithEmail(email)
            result = await query(queryText)
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'User not found'
            })
        }

        if (result.rowCount > 0) {
            const storedHash = result.rows[0].password_hash
            const isMatch = await compare(password, storedHash)
            if (isMatch) {
                res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Login successful'
                })
            } else {
                res.status(401).json({
                    status: 'error',
                    statusCode: 401,
                    message: 'Invalid password'
                })
            }
        }

        console.log('/auth/login end')
    } catch (err) {
        console.log('Error in /auth/login api', err)
        res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Something went wrong'
        })
    }
}

export {
    registerUser,
    loginUser
}