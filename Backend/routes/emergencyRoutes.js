const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/emergencyRequest'); // Model for emergency requests
const {body, validationResult} = require('express-validator');



// router.get("/test", (req, res) => res.send("router testing!"));



// Create a new emergency request
router.post('/', [

  body('name').notEmpty().withMessage('Name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('location.coordinates').isArray().withMessage('Location coordinates must be an array'),
  body('vehicleType').isIn(['car', 'motorcycle', 'bus', 'truck', 'other']).withMessage('Invalid vehicle type'),
  body('vehicleColor').notEmpty().withMessage('Vehicle color is required'),
  body('emergencyType').isIn(['breakdown', 'accident', 'flat_tire', 'other']).withMessage('Invalid emergency type'),
  body('description').notEmpty().withMessage('Description is required')

],
   async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const emergencyRequest = new EmergencyRequest(req.body);
    await emergencyRequest.save();
    res.status(201).json(emergencyRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Get all emergency requests
router.get('/', async (req, res) => {
  try {
    const emergencyRequests = await EmergencyRequest.find();
    res.json(emergencyRequests);
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
    res.json(emergencyRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an emergency request
router.put('/:id', [
  
  body('name').optional().notEmpty().withMessage('Name must not be empty'),
  body('contactNumber').optional().notEmpty().withMessage('Contact number must not be empty'),
  body('location.coordinates').optional().isArray().withMessage('Location coordinates must be an array'),
  body('vehicleType').optional().isIn(['car', 'motorcycle', 'bus', 'truck', 'other']).withMessage('Invalid vehicle type'),
  body('vehicleColor').optional().notEmpty().withMessage('Vehicle color must not be empty'),
  body('emergencyType').optional().isIn(['breakdown', 'accident', 'flat_tire', 'other']).withMessage('Invalid emergency type'),
  body('description').optional().notEmpty().withMessage('Description must not be empty'),
  body('status').optional().isIn(['pending', 'confirmed', 'completed']).withMessage('Invalid status')

],async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }
    res.json(emergencyRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an emergency request
router.delete('/:id', async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.findByIdAndDelete(req.params.id);
    if (!emergencyRequest) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }
    res.json({ message: 'Emergency request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// Compare this snippet from Backend/models/emergencyRequest.js: