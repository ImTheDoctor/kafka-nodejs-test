const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { dbConfig } = require('./config/dbConfig.js')
dbConfig()

app.use(bodyParser.json());
app.use('/', require('./routes/auth.js'))

app.listen(3007, () => {
    console.log('Server running on port 3007');
});