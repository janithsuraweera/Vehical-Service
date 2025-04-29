const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get total users count
router.get('/count', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error getting users count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 