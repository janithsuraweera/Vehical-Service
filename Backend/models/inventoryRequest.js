const mongoose = require('mongoose');

const inventoryRequestSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0
  },
  productQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  productDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['oils', 'vehicle lights', 'shock absorbers', 'tire', 'other']
  },
  productImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryRequest', inventoryRequestSchema);

