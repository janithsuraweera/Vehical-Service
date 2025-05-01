const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const EmergencyRequest = require('../models/emergencyRequest');

// Configure multer for photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/emergency';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only jpeg and png
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Create new emergency request
router.post('/', upload.array('photos', 5), async (req, res) => {
    try {
        const {
            name,
            contactNumber,
            vehicleNumber,
            location,
            vehicleType,
            vehicleColor,
            emergencyType,
            description
        } = req.body;

        // Parse location if it's a string
        const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

        // Get photo paths
        const photoPaths = req.files ? req.files.map(file => file.path) : [];

        const emergencyRequest = new EmergencyRequest({
            name,
            contactNumber,
            vehicleNumber,
            location: parsedLocation,
            vehicleType,
            vehicleColor,
            emergencyType,
            description,
            photos: photoPaths
        });

        await emergencyRequest.save();

        res.status(201).json({
            success: true,
            data: emergencyRequest
        });
    } catch (error) {
        console.error('Error creating emergency request:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get all emergency requests
router.get('/', async (req, res) => {
    try {
        const emergencyRequests = await EmergencyRequest.find().sort({ createdAt: -1 });
        // Transform photo URLs to include the full server URL
        const transformedRequests = emergencyRequests.map(request => {
            const transformed = request.toObject();
            if (transformed.photos && transformed.photos.length > 0) {
                transformed.photos = transformed.photos.map(photo => 
                    photo.startsWith('http') ? photo : `http://localhost:5000/${photo}`
                );
            }
            return transformed;
        });
        res.json(transformedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get emergency request by ID
router.get('/:id', async (req, res) => {
    try {
        const emergencyRequest = await EmergencyRequest.findById(req.params.id);
        if (!emergencyRequest) {
            return res.status(404).json({ message: 'Emergency request not found' });
        }
        // Transform photo URLs to include the full server URL
        const transformed = emergencyRequest.toObject();
        if (transformed.photos && transformed.photos.length > 0) {
            transformed.photos = transformed.photos.map(photo => 
                photo.startsWith('http') ? photo : `http://localhost:5000/${photo}`
            );
        }
        res.json(transformed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update emergency request
router.patch('/:id', async (req, res) => {
    try {
        const emergencyRequest = await EmergencyRequest.findById(req.params.id);
        if (!emergencyRequest) {
            return res.status(404).json({ message: 'Emergency request not found' });
        }

        Object.keys(req.body).forEach(key => {
            emergencyRequest[key] = req.body[key];
        });

        const updatedEmergencyRequest = await emergencyRequest.save();
        res.json(updatedEmergencyRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete emergency request
router.delete('/:id', async (req, res) => {
    try {
        const emergencyRequest = await EmergencyRequest.findById(req.params.id);
        if (!emergencyRequest) {
            return res.status(404).json({ message: 'Emergency request not found' });
        }

        // Delete associated photos
        if (emergencyRequest.photos && emergencyRequest.photos.length > 0) {
            emergencyRequest.photos.forEach(photoPath => {
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            });
        }

        await emergencyRequest.remove();
        res.json({ message: 'Emergency request deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 