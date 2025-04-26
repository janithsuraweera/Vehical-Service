const express = require('express');
const router = express.Router();
const InventoryRequest = require('../models/inventoryRequest'); // Model for inventory requests
const {body, validationResult} = require('express-validator');

// Create a new inventory item
router.post('/', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('productName').notEmpty().withMessage('Product name is required'),
  body('productPrice').isNumeric().withMessage('Product price must be a number'),
  body('productQuantity').isInt({min: 0}).withMessage('Product quantity must be a positive integer'),
  body('productDescription').optional(),
  body('productImage').optional()
],
   async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const inventoryRequest = new InventoryRequest(req.body);
    await inventoryRequest.save();
    res.status(201).json(inventoryRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventoryRequests = await InventoryRequest.find();
    res.json(inventoryRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const inventoryRequest = await InventoryRequest.findById(req.params.id);
    if (!inventoryRequest) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(inventoryRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an inventory item

router.put('/:id', [
  body('productId').optional().notEmpty().withMessage('Product ID must not be empty'),
  body('productName').optional().notEmpty().withMessage('Product name must not be empty'),
  body('productPrice').optional().isNumeric().withMessage('Product price must be a number'),
  body('productQuantity').optional().isInt({min: 0}).withMessage('Product quantity must be a positive integer'),
  body('productDescription').optional(),
  body('productImage').optional()
],async (req, res) => {
  try {
    const inventoryRequest = await InventoryRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inventoryRequest) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(inventoryRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an inventory item 
router.delete('/:id', async (req, res) => {
  try {
    const inventoryRequest = await InventoryRequest.findByIdAndDelete(req.params.id);
    if (!inventoryRequest) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;