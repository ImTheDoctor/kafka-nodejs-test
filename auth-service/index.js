// const express = require('express')
// // const kafka = require('kafka-node');
// // const sequelize = require('sequelize')

// const app = express()
// app.use(express.json())

// // const db = new sequelize(process.env.POSTGRES_URL, { pool: { min: 0, max: 5 } })
// // const User = db.define('user', {
// //     name: sequelize.STRING,
// //     email: sequelize.STRING,
// //     password: sequelize.STRING
// // });

// // db.sync()
// //     .then(() => {
// //         const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS })
// //         const producer = new kafka.Producer(client)
// //         producer.on('ready', () => {
// //             app.post('/', (req, res) => {
// //                 try {
// //                     producer.send([{
// //                         topic: process.env.KAFKA_TOPIC,
// //                         messages: JSON.stringify(req.body)
// //                     }], (err, data) => {
// //                         if (err) {
// //                             res.status(500).send({ error: "Error sending message to Kafka" })
// //                         } else {
// //                             res.status(200).send(data);
// //                         }
// //                     })
// //                 } catch (err) {
// //                     res.status(500).send({ error: "Error processing request" })
// //                 }
// //             })
// //         })
// //     })
// //     .catch((err) => {
// //         console.log("Error connecting to the database: ", err);
// //     });

// app.get('/', (req,res)=>{
//     res.send('Auth')
// })


// app.listen(3007, (error) => {
//     error ? console.log(error) : console.log(`Listening port 3007`)
// })

const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize('postgres://postgres:postgres@127.0.0.1:5432/authDB');

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

// Define your User model here using Sequelize
const User = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


app.post("/register", async (req, res) => {
    try {
        sequelize.sync().then(() => {
            const { name, email, password } = req.body;
            const user = User.create({ name, email, password });
            res.json({ message: "User created successfully", user });
        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Compare password here
        if (password !== user.password) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});


app.listen(3007, () => {
    console.log("Auth service listening on port 3007");
});

