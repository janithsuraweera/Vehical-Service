const mongoose = require('mongoose');

const inventoryRequestSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    productDescription: {
        type: String,
    },
    productImage: {
        type: String, // This will store the image path or URL
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: false }); // timestamps option is set to false to disable createdAt and updatedAt fields

module.exports = mongoose.model('InventoryRequest', inventoryRequestSchema);
//test resalt