const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/auth')

const { Kafka } = require('kafkajs')
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092'],
})
const producer = kafka.producer()

module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Logged in successfully',
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}

module.exports.register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        await producer.connect()
        await producer.send({
            topic: 'auth',
            message : JSON.stringify({email, name})
        })
        res.status(201).json({
            message: 'User created successfully!',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}