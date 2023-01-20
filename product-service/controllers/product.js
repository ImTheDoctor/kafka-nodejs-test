const Product = require('../model/product')
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092'],
})
const producer = kafka.producer()
const consumer = kafka.consumer()
await consumer.connect()
await consumer.subscribe({ topic: 'auth', fromBeginning: true })

consumer.run({
    eachMessage: async ({ topic, message }) => {
        const authMessage = JSON.parse(message.value.toString())
        if (authMessage.action === 'create') {
            
            const newProduct = new Product({
                name: authMessage.name,
                user: authMessage.user,
                type: authMessage.type,
                brand: authMessage.brand,
                description: authMessage.description
            });
            await newProduct.save();
        } else if (authMessage.action === 'update') {

            await Product.findByIdAndUpdate(authMessage.id, {
                name: authMessage.name,
                user: authMessage.user,
                type: authMessage.type,
                brand: authMessage.brand,
                description: authMessage.description
            });
        } else if (authMessage.action === 'delete') {

            await Product.findByIdAndRemove(authMessage.id);
        }
    },
});

module.exports.getProduct = async (req, res) => {
    try {
        const product = await Product.find().exec()
        res.status(200).json(product)
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Products not found'
        })
    }
}

module.exports.addProduct = async (req, res) => {

    await producer.connect()
    await producer.send({
        topic: 'auth',
        messages: [
            { value: JSON.stringify({ action: 'create', ...req.body }) },
        ],
    })
    await producer.disconnect()

    res.status(200).json({ message: 'Product created successfully' })
}

module.exports.deleteProduct = async (req, res) => {

    await producer.connect()
    await producer.send({
        topic: 'auth',
        messages: [
            { value: JSON.stringify({ action: 'delete', id: req.params.id }) },
        ],
    })
    await producer.disconnect()

    res.status(200).json({ message: 'Product deleted successfully' })
}

module.exports.updateProduct = async (req, res) => {

    await producer.connect()
    await producer.send({
        topic: 'auth',
        messages: [
            { value: JSON.stringify({ action: 'update', id: req.params.id, ...req.body }) },
        ],
    })
    await producer.disconnect()

    res.status(200).json({ message: 'Product updated successfully' })
}