const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/emergencyRequest'); // Model for emergency requests
const {body, validationResult} = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

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
router.post('/', auth, upload.array('photos', 5), [
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
  console.log('Received emergency request:', req.body);
  console.log('Received files:', req.files);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
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
    // Handle photos - if no photos are uploaded, use an empty array
    const photoUrls = req.files ? req.files.map(file => `/uploads/emergency/${file.filename}`) : [];
    console.log('Generated photo URLs:', photoUrls);

    const emergencyRequest = new EmergencyRequest({
      ...req.body,
      userId: req.user._id, // Add the user ID
      location,
      photos: photoUrls
    });

    console.log('Saving emergency request:', emergencyRequest);
    await emergencyRequest.save();
    console.log('Saved emergency request:', emergencyRequest);

    // Transform the response to include full URLs
    const transformedRequest = {
      ...emergencyRequest.toObject(),
      photos: photoUrls.map(url => `http://localhost:5000${url}`)
    };

    res.status(201).json(transformedRequest);
  } catch (error) {
    console.error('Error saving emergency request:', error);
    // Delete uploaded files if saving fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Get all emergency requests for the current user or all if admin
router.get('/', auth, async (req, res) => {
  try {
    let emergencyRequests;
    if (req.user.role === 'admin') {
      // Admin: get all requests
      emergencyRequests = await EmergencyRequest.find({});
    } else {
      // Normal user: only their own
      emergencyRequests = await EmergencyRequest.find({ userId: req.user._id });
    }
    // Transform photo URLs to include the full server URL
    const transformedRequests = emergencyRequests.map(request => {
      const transformed = {
        ...request.toObject(),
        photos: request.photos ? request.photos.map(photo => {
          if (photo.startsWith('http')) {
            return photo;
          }
          return `http://localhost:5000${photo}`;
        }) : []
      };
      return transformed;
    });
    res.json(transformedRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an emergency request by ID (admin can view any, users can only view their own)
router.get('/:id', auth, async (req, res) => {
  try {
    let emergencyRequest;
    
    // Admin can view any emergency request
    if (req.user.role === 'admin') {
      emergencyRequest = await EmergencyRequest.findById(req.params.id);
    } else {
      // Regular users can only view their own requests
      emergencyRequest = await EmergencyRequest.findOne({
        _id: req.params.id,
        userId: req.user._id
      });
    }
    
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found or access denied' });
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

// Update an emergency request (admin can update any, users can only update their own)
router.put('/:id', auth, upload.array('photos', 5), [
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
  body('status').optional().isIn(['pending', 'Processing', 'Completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    let emergencyRequest;
    
    // Admin can update any emergency request
    if (req.user.role === 'admin') {
      emergencyRequest = await EmergencyRequest.findById(req.params.id);
    } else {
      // Regular users can only update their own requests
      emergencyRequest = await EmergencyRequest.findOne({
        _id: req.params.id,
        userId: req.user._id
      });
    }
    
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found or access denied' });
    }

    // Track changes
    const changes = new Map();
    const oldValues = emergencyRequest.toObject();

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

    // Create update object with only the fields that are being updated
    const updateFields = {};
    Object.keys(req.body).forEach(key => {
      if (key !== 'userId' && req.body[key] !== undefined) {
        updateFields[key] = req.body[key];
      }
    });

    // Update the request
    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    // Track changes for each field
    Object.keys(updateFields).forEach(key => {
      if (JSON.stringify(oldValues[key]) !== JSON.stringify(updateFields[key])) {
        changes.set(key, {
          oldValue: oldValues[key],
          newValue: updateFields[key]
        });
      }
    });

    // Add update history
    if (changes.size > 0) {
      updatedRequest.updateHistory.push({
        updatedBy: req.user._id,
        changes: changes
      });
      await updatedRequest.save();
    }

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

// Delete an emergency request (admin can delete any, users can only delete their own)
router.delete('/:id', auth, async (req, res) => {
  try {
    let emergencyRequest;
    
    // Admin can delete any emergency request
    if (req.user.role === 'admin') {
      emergencyRequest = await EmergencyRequest.findById(req.params.id);
    } else {
      // Regular users can only delete their own requests
      emergencyRequest = await EmergencyRequest.findOne({
        _id: req.params.id,
        userId: req.user._id
      });
    }
    
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found or access denied' });
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
    res.json({ message: 'Emergency request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this new route after the existing routes
router.get('/user', auth, async (req, res) => {
    try {
        const emergencies = await EmergencyRequest.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (error) {
        console.error('Error fetching user emergencies:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
// Compare this snippet from Backend/models/emergencyRequest.js: