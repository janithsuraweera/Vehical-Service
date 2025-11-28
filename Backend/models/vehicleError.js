const mongoose = require('mongoose');

const vehicleErrorSchema = new mongoose.Schema({
  vehicleRegistrationNumber: {
    type: String,
    required: true,
    trim: true
  },
  errorType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'cancelled'],
    default: 'pending'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolutionNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleError', vehicleErrorSchema);

