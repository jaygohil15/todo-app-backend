import { text } from 'express'
import { query } from '../db/index.js'
import { insertTodo } from '../db/queries.js'

const createTodo = async (req, res) => {
    try {
        console.log('/todo Start')
        console.log(req.body)
        
        const {
            todo_name = '',
            todo_description = ''
        } = req.body
        const queryText = insertTodo(todo_name, todo_description)
        const result = await query(queryText)
        console.log('result', result.rows[0])
        res.send(result.rows[0])
        console.log('/todo End')
    } catch(err) {
        console.log('Error in /todo')
        console.log('err.detail', err?.detail)
        console.log(err)
        res.status(500).send({
            status: 'error',
            errorText: 'Something unexpected happaned',
        })
    }
}

export {
    createTodo
}