const express = require('express')
const mongoose = require('mongoose')
const auth = require('./Routes/routes')

const app = express()
app.use(express.json())

const dotenv = require('dotenv')
dotenv.config() 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to TP6'))
    .catch(err => console.error(err))

app.use('/auth-service', auth)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Auth service PORT: ${PORT}`))