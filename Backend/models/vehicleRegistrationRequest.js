const mongoose = require('mongoose');

const vehicleRegistrationRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  customerNIC: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'bus', 'truck', 'van', 'other']
  },
  vehicleModel: {
    type: String,
    required: true,
    enum: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Benz', 'other']
  },
  vehicleColor: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleRegistrationRequest', vehicleRegistrationRequestSchema);

