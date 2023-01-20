const express = require('express')

const app = express()
app.use(express.json())

const { connectDB } = require('./config/connectDB.js')
connectDB()

app.use('/', require('./routes/product')

)
app.listen(3008, (error) => {
    error ? console.log(error) : console.log(`Listening port 3008`)
})