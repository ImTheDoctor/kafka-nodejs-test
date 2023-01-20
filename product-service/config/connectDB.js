const dotenv = require('dotenv')
dotenv.config()
const mongoose = require("mongoose");

async function connectDB() {
    mongoose.Promise = global.Promise;
    await mongoose
        .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to DB'))
        .catch((error) => console.log('DB error', error))
}
module.exports = connectDB;