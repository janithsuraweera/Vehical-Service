const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      default: ''
    }
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'bus', 'truck', 'other', 'van']
  },
  vehicleColor: {
    type: String,
    required: true
  },
  emergencyType: {
    type: String,
    required: true,
    enum: ['breakdown', 'accident', 'flat_tire', 'other']
  },
  description: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Create geospatial index for location
emergencyRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);

