const express = require('express')
const mongoose = require('mongoose')
const auth = require('./Routes/routes')
const app = express()
app.use(express.json())


mongoose.connect('mongodb://localhost:27017/cloud')
    .then(() => console.log('Connected to TP6'))
    .catch(err => console.error(err))

app.use('/auth-service', auth)

const PORT = 3000
app.listen(PORT, () => console.log(`Auth service PORT: ${PORT}`))