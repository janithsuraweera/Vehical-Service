const express = require('express');
const router = express.Router();
const VehicleError = require('../models/vehicleError');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const openai = require('../config/openai');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/error-photos/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Invalid file type. Only JPEG, PNG, and JPG files are allowed.');
            error.code = 'LIMIT_FILE_TYPES';
            return cb(error, false);
        }
        cb(null, true);
    }
});

// Report a new vehicle error
router.post('/report', auth, upload.array('photos', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one photo' });
        }

        const { vehicleRegistrationNumber, errorType, description, severity, location } = req.body;
        
        const photoUrls = req.files.map(file => `/uploads/error-photos/${file.filename}`);

        const error = new VehicleError({
            userId: req.user._id,
            vehicleRegistrationNumber,
            errorType,
            description,
            photos: photoUrls,
            severity,
            location
        });

        await error.save();
        res.status(201).json(error);
    } catch (error) {
        if (error.code === 'LIMIT_FILE_TYPES') {
            return res.status(400).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
});

// Get all errors for a user
router.get('/my-errors', auth, async (req, res) => {
    try {
        const errors = await VehicleError.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(errors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all errors (admin only)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const errors = await VehicleError.find()
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        res.json(errors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update error status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status } = req.body;
        const error = await VehicleError.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!error) {
            return res.status(404).json({ message: 'Error report not found' });
        }

        res.json(error);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Multer storage configuration
const vehicleErrorStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/vehicle-errors'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter to allow only images
const vehicleErrorFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const vehicleErrorUpload = multer({
    storage: vehicleErrorStorage,
    fileFilter: vehicleErrorFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload image endpoint
router.post('/upload', auth, vehicleErrorUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'කරුණාකර ඡායාරූපයක් උඩුගත කරන්න' });
        }

        const imageUrl = `/uploads/vehicle-errors/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'ඡායාරූපය උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය' });
    }
});

// Analyze image endpoint
router.post('/analyze', auth, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ message: 'ඡායාරූප URL එකක් අවශ්‍යයි' });
        }

        // Call ChatGPT API to analyze the image
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "මෙම වාහන ඡායාරූපය විශ්ලේෂණය කර පහත තොරතුරු සපයන්න: 1. දෝෂ වර්ගය (එන්ජින්, ටයර්, බ්‍රේක්, ආදිය) 2. දෝෂයේ තත්වය (අඩු, මධ්‍යම, උසස්) 3. විස්තර 4. ස්ථානය. පිළිතුර JSON format එකක් වශයෙන් සපයන්න."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `http://localhost:5000${imageUrl}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        });

        // Parse the response
        const analysis = JSON.parse(response.choices[0].message.content);

        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error analyzing image:', error);
        res.status(500).json({ message: 'ඡායාරූපය විශ්ලේෂණය කිරීමේදී දෝෂයක් ඇතිවිය' });
    }
});

module.exports = router; 