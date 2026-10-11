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
        text: `select user_id, password_hash from users where username = $1`,
        values: [username]
    }
}

const getPasswordHashWithEmail = (email) => {
    return {
        text: `select user_id, password_hash from users where email = $1`,
        values: [email]
    }
}

const insertSessionToken = (user_id, token_hash, expires_at, ip_address, user_agent) => {
    return {
        text: `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at) values ($1, $2, $3, $4, $5)`,
        values: [user_id, token_hash, expires_at, ip_address, user_agent]
    }
}

const deleteActiveSession = (user_id, user_agent) => {
    return {
        text: `DELETE from sessions where user_id = $1 and user_agent = $2`,
        values: [user_id, user_agent]
    }
}

export {
    insertTodo,
    registerUserQuery,
    getPasswordHashWithUsername,
    getPasswordHashWithEmail,
    insertSessionToken,
    deleteActiveSession
}