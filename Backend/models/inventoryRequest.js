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
        required: true,
    },
    productImage: {
        type: String, // This will store the image path
    },
    category: {
        type: String,
        required: true,
        enum: ['oils', 'vehicle lights', 'shock absorbers', 'tire', 'other']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: false });

module.exports = mongoose.model('InventoryRequest', inventoryRequestSchema);
//test new one again