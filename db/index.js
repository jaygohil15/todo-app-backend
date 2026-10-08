import { Pool } from 'pg'

let pool

const getPool = () => {
    if(!pool) {
        pool = new Pool({
            connectionString: process.env.CONNECTION_STRING
        })
        pool.on('connect', () => {
            console.log('Connected to the DB...')
        })
    }
    return pool
}

export const query = async (text, params) => {
    const start = Date.now()
    const res = await getPool().query(text, params)
    const duration = `${(Date.now() - start)/1000} s`
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
}

export const getClient = async () => {
  const client = await getPool().connect()
  return client
}
 