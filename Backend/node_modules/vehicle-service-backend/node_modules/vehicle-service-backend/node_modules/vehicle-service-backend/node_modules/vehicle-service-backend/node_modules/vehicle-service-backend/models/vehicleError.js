const mongoose = require('mongoose');

const vehicleErrorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleRegistrationNumber: {
        type: String,
        required: true
    },
    errorType: {
        type: String,
        required: true,
        enum: ['engine', 'brake', 'electrical', 'transmission', 'suspension', 'other']
    },
    description: {
        type: String,
        required: true
    },
    photos: [{
        type: String, // URL to the stored image
        required: true
    }],
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in_progress', 'resolved'],
        default: 'pending'
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical']
    },
    location: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VehicleError', vehicleErrorSchema); 