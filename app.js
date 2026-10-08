import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import { router } from './routes/index.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173' }));

const myMiddelware = (req, res, next) => {
  // console.log('req', req)
  // console.log('res', res)
  next()
}

config()
app.use(express.json())
app.use(myMiddelware)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/v1', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})