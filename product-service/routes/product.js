const express = require('express')
const { getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/product')

const router = express.Router()
router.get('/', getProduct)
router.post('/', addProduct)
router.delete('/:id', deleteProduct)
router.patch('/:id', updateProduct)
module.exports = router