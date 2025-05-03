const mongoose = require('mongoose');

const vehicleRegistrationRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  customerNIC: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    
  },
  vehicleType: {
    type: String,
    enum: ['car', 'motorcycle', 'bus', 'truck', 'van', 'other'],
    required: true,
  },
  vehicleModel: {
    type: String,
    enum: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Benz', 'other'],
    required: true,
  },
  vehicleColor: {
    type: String,
    required: true,
    match: /^#([0-9A-F]{3}){1,2}$/i,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('VehicleRegistrationRequest', vehicleRegistrationRequestSchema);