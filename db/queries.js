const insertTodo = (todo_name, todo_description) => {
    return {
        text: 'INSERT INTO todo (todo_name, todo_description) values ($1, $2)',
        values: [todo_name, todo_description]
    }
}

const registerUserQuery = (username, first_name, email, password_hash) => {
    return {
        text: `INSERT INTO users (username, first_name, email, password_hash) values ($1, $2, $3, $4)
                RETURNING username
        `,
        values: [username, first_name, email, password_hash]
    }
}

export {
    insertTodo,
    registerUserQuery
}