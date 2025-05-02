const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');//authorizes the server to accept JSON data in a POST request
const path = require('path');
const inventoryRoutes = require('./routes/inventoryRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const vehicleRegistrationRequestRoutes = require('./routes/vehicleRegistrationRequestRoutes');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const chatbotRoutes = require('./routes/chatbot');
const fs = require('fs');

require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const inventoryDir = path.join(uploadsDir, 'inventory');
const emergencyDir = path.join(uploadsDir, 'emergency');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(inventoryDir)) {
    fs.mkdirSync(inventoryDir, { recursive: true });
}
if (!fs.existsSync(emergencyDir)) {
    fs.mkdirSync(emergencyDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/jpeg');
        }
    }
}));

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/vehicle-registration', vehicleRegistrationRequestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/', (req, res) => {res.send('Welcome DB');

});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//added by me


