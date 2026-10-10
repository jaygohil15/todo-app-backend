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

const getPasswordHashWithUsername = (username) => {
    return {
        text: `select password_hash from users where username = $1`,
        values: [username]
    }
}

const getPasswordHashWithEmail = (email) => {
    return {
        text: `select password_hash from users where email = $1`,
        values: [email]
    }
}

export {
    insertTodo,
    registerUserQuery,
    getPasswordHashWithUsername,
    getPasswordHashWithEmail
}