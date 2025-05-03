const express = require('express');
const router = express.Router();
const InventoryRequest = require('../models/inventoryRequest'); // Model for inventory requests
const {body, validationResult} = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'inventory');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'inventory-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
        }
        cb(null, true);
    }
});

// Create a new inventory item
router.post('/', upload.single('productImage'), [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('productName').notEmpty().withMessage('Product name is required'),
    body('productPrice').isNumeric().withMessage('Product price must be a number'),
    body('productQuantity').isInt({min: 0}).withMessage('Product quantity must be a positive integer'),
    body('productDescription').notEmpty().withMessage('Product description is required'),
    body('category').isIn(['oils', 'vehicle lights', 'shock absorbers', 'tire', 'other']).withMessage('Invalid category')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const inventoryData = {
            ...req.body,
            productImage: req.file ? `/uploads/inventory/${req.file.filename}` : null
        };

        const inventoryRequest = new InventoryRequest(inventoryData);
        await inventoryRequest.save();
        
        // Transform the response to include full URL for image
        const transformedRequest = {
            ...inventoryRequest.toObject(),
            productImage: inventoryRequest.productImage ? `http://localhost:5000${inventoryRequest.productImage}` : null
        };

        res.status(201).json(transformedRequest);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
});

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const inventoryRequests = await InventoryRequest.find();
        // Transform the response to include full URLs for images
        const transformedRequests = inventoryRequests.map(request => {
            const requestObj = request.toObject();
            // Handle both old and new image paths
            let imageUrl = null;
            if (requestObj.productImage) {
                if (requestObj.productImage.startsWith('http')) {
                    imageUrl = requestObj.productImage;
                } else if (requestObj.productImage.startsWith('/uploads')) {
                    imageUrl = `http://localhost:5000${requestObj.productImage}`;
                } else {
                    imageUrl = `http://localhost:5000/uploads/inventory/${requestObj.productImage}`;
                }
            }
            return {
                ...requestObj,
                productImage: imageUrl
            };
        });
        res.json(transformedRequests);
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
        // Transform the response to include full URL for image
        const requestObj = inventoryRequest.toObject();
        let imageUrl = null;
        if (requestObj.productImage) {
            if (requestObj.productImage.startsWith('http')) {
                imageUrl = requestObj.productImage;
            } else if (requestObj.productImage.startsWith('/uploads')) {
                imageUrl = `http://localhost:5000${requestObj.productImage}`;
            } else {
                imageUrl = `http://localhost:5000/uploads/inventory/${requestObj.productImage}`;
            }
        }
        const transformedRequest = {
            ...requestObj,
            productImage: imageUrl
        };
        res.json(transformedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an inventory item
router.put('/:id', upload.single('productImage'), [
    body('productId').optional().notEmpty().withMessage('Product ID must not be empty'),
    body('productName').optional().notEmpty().withMessage('Product name must not be empty'),
    body('productPrice').optional().isNumeric().withMessage('Product price must be a number'),
    body('productQuantity').optional().isInt({min: 0}).withMessage('Product quantity must be a positive integer'),
    body('productDescription').optional().notEmpty().withMessage('Product description must not be empty'),
    body('category').optional().isIn(['oils', 'vehicle lights', 'shock absorbers', 'tire', 'other']).withMessage('Invalid category')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Delete uploaded file if validation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updateData = { ...req.body };
        
        // If a new image is uploaded, update the image path
        if (req.file) {
            updateData.productImage = `/uploads/inventory/${req.file.filename}`;
        }

        const inventoryRequest = await InventoryRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!inventoryRequest) {
            // Delete uploaded file if item not found
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        // Transform the response to include full URL for image
        const transformedRequest = {
            ...inventoryRequest.toObject(),
            productImage: inventoryRequest.productImage ? `http://localhost:5000${inventoryRequest.productImage}` : null
        };

        res.json(transformedRequest);
    } catch (error) {
        // Delete uploaded file if saving fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
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