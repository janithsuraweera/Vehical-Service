const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const emergencyRequestSchema = new mongoose.Schema({
    emergencyRequestNo: {
        type: String,
        unique: true,
        default: uuidv4,
        immutable: false,
    },
    name: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        address: {
            type: String,
        },
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'bus', 'truck', 'other', 'van'],
        required: true,
    },
    vehicleColor: {
        type: String,
        required: true,
        match: /^#([0-9A-F]{3}){1,2}$/i, // valid hex code only
    },
    emergencyType: {
        type: String,
        enum: ['breakdown', 'accident', 'flat_tire', 'other'],
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed'],
        default: 'pending',
    },
    photos: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    vehicleNumber: {
        type: String,
        sparse: true, 
        // required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    time: {
        type: String,
        default: () => {
            const now = new Date();
            return now.toLocaleTimeString(); 
        },
    },
}, { timestamps: false }); // timestamps option is set to false to disable createdAt and updatedAt fields

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
