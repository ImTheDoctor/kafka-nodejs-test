const express = require('express')

const app = express()
app.use(express.json())

app.get('/product', (req,res)=>{
    res.send('Product')
})
app.listen(3008, (error) => {
    error ? console.log(error) : console.log(`Listening port 3008`)
})