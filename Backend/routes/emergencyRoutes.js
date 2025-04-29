const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/emergencyRequest'); // Model for emergency requests
const {body, validationResult} = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'emergency');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'emergency-' + uniqueSuffix + path.extname(file.originalname));
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

// router.get("/test", (req, res) => res.send("router testing!"));

// Create a new emergency request
router.post('/', upload.array('photos', 5), [
  body('name').notEmpty().withMessage('Name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('location').custom((value) => {
    try {
      const location = JSON.parse(value);
      if (!location.coordinates || !Array.isArray(location.coordinates)) {
        throw new Error('Invalid location coordinates');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid location format');
    }
  }),
  body('vehicleType').isIn(['car', 'motorcycle', 'bus', 'truck', 'other', 'van']).withMessage('Invalid vehicle type'),
  body('vehicleColor').notEmpty().withMessage('Vehicle color is required'),
  body('emergencyType').isIn(['breakdown', 'accident', 'flat_tire', 'other']).withMessage('Invalid emergency type'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Delete uploaded files if validation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const location = JSON.parse(req.body.location);
    const photoUrls = req.files ? req.files.map(file => `/uploads/emergency/${file.filename}`) : [];

    const emergencyRequest = new EmergencyRequest({
      ...req.body,
      location,
      photos: photoUrls
    });

    await emergencyRequest.save();
    res.status(201).json(emergencyRequest);
  } catch (error) {
    // Delete uploaded files if saving fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(400).json({ message: error.message });
  }
});

//  Get all emergency requests
router.get('/', async (req, res) => {
  try {
    const emergencyRequests = await EmergencyRequest.find();
    // Transform photo URLs to include the full server URL
    const transformedRequests = emergencyRequests.map(request => ({
      ...request.toObject(),
      photos: request.photos ? request.photos.map(photo => `http://localhost:5000${photo}`) : []
    }));
    res.json(transformedRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an emergency request by ID
router.get('/:id', async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.findById(req.params.id);
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }
    // Transform photo URLs to include the full server URL
    const transformedRequest = {
      ...emergencyRequest.toObject(),
      photos: emergencyRequest.photos ? emergencyRequest.photos.map(photo => `http://localhost:5000${photo}`) : []
    };
    res.json(transformedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an emergency request
router.put('/:id', upload.array('photos', 5), [
  body('name').optional().notEmpty().withMessage('Name must not be empty'),
  body('contactNumber').optional().notEmpty().withMessage('Contact number must not be empty'),
  body('location').optional().custom((value) => {
    try {
      const location = JSON.parse(value);
      if (!location.coordinates || !Array.isArray(location.coordinates)) {
        throw new Error('Invalid location coordinates');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid location format');
    }
  }),
  body('vehicleType').optional().isIn(['car', 'motorcycle', 'bus', 'truck', 'other', 'van']).withMessage('Invalid vehicle type'),
  body('vehicleColor').optional().notEmpty().withMessage('Vehicle color must not be empty'),
  body('emergencyType').optional().isIn(['breakdown', 'accident', 'flat_tire', 'other']).withMessage('Invalid emergency type'),
  body('description').optional().notEmpty().withMessage('Description must not be empty'),
  body('status').optional().isIn(['pending', 'confirmed', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.findById(req.params.id);
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    // Handle location update
    if (req.body.location) {
      req.body.location = JSON.parse(req.body.location);
    }

    // Handle photo updates
    if (req.files && req.files.length > 0) {
      // Delete old photos
      if (emergencyRequest.photos) {
        emergencyRequest.photos.forEach(photoUrl => {
          const photoPath = path.join(__dirname, '..', photoUrl);
          if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
          }
        });
      }

      // Add new photos
      const photoUrls = req.files.map(file => `/uploads/emergency/${file.filename}`);
      req.body.photos = photoUrls;
    }

    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Transform photo URLs to include the full server URL
    const transformedRequest = {
      ...updatedRequest.toObject(),
      photos: updatedRequest.photos ? updatedRequest.photos.map(photo => `http://localhost:5000${photo}`) : []
    };

    res.json(transformedRequest);
  } catch (error) {
    // Delete uploaded files if update fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete an emergency request
router.delete('/:id', async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.findById(req.params.id);
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    // Delete associated photos
    if (emergencyRequest.photos) {
      emergencyRequest.photos.forEach(photoUrl => {
        const photoPath = path.join(__dirname, '..', photoUrl);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      });
    }

    await EmergencyRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Emergency request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// Compare this snippet from Backend/models/emergencyRequest.js: