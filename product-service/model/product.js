import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    user: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        unique: true,
    },
    type: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);