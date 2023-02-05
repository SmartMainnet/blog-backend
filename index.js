import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router.js'

const { PORT, MONGODB_URI } = process.env

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch(err => console.error('DB error', err))

const app = express()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use('/', router)

app.listen(PORT, err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Listening on port 5000')
  }
})
