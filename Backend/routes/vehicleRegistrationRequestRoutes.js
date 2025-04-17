const express = require('express');
const router = express.Router();
const VehicleRegistrationRequest = require('../models/vehicleRegistrationRequest');
const { body, validationResult } = require('express-validator');

//aluth registation ekk
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('customerNIC').notEmpty().withMessage('Customer NIC is required'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleType').isIn(['car', 'motorcycle', 'bus', 'truck', 'van', 'other']).withMessage('Invalid vehicle type'),
  body('vehicleModel').isIn(['Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Benz', 'other']).withMessage('Invalid vehicle model'),
  body('vehicleColor').notEmpty().withMessage('Vehicle color is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vehicleRegistrationRequest = new VehicleRegistrationRequest(req.body);
    await vehicleRegistrationRequest.save();
    res.status(201).json(vehicleRegistrationRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//all requests
router.get('/', async (req, res) => {
  try {
    const vehicleRegistrationRequests = await VehicleRegistrationRequest.find();
    res.json(vehicleRegistrationRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fillter by id
router.get('/:id', async (req, res) => {
  try {
    const vehicleRegistrationRequest = await VehicleRegistrationRequest.findById(req.params.id);
    if (!vehicleRegistrationRequest) {
      return res.status(404).json({ message: 'Vehicle registration request not found' });
    }
    res.json(vehicleRegistrationRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Name must not be empty'),
  body('customerNIC').optional().notEmpty().withMessage('Customer NIC must not be empty'),
  body('vehicleNumber').optional().notEmpty().withMessage('Vehicle number must not be empty'),
  body('vehicleType').optional().isIn(['car', 'motorcycle', 'bus', 'truck', 'van', 'other']).withMessage('Invalid vehicle type'),
  body('vehicleModel').optional().isIn(['Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Benz', 'other']).withMessage('Invalid vehicle model'),
  body('vehicleColor').optional().notEmpty().withMessage('Vehicle color must not be empty'),
], async (req, res) => {
  try {
    const vehicleRegistrationRequest = await VehicleRegistrationRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicleRegistrationRequest) {
      return res.status(404).json({ message: 'Vehicle registration request not found' });
    }
    res.json(vehicleRegistrationRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete
router.delete('/:id', async (req, res) => {
  try {
    const vehicleRegistrationRequest = await VehicleRegistrationRequest.findByIdAndDelete(req.params.id);
    if (!vehicleRegistrationRequest) {
      return res.status(404).json({ message: 'Vehicle registration request not found' });
    }
    res.json({ message: 'Vehicle registration request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
