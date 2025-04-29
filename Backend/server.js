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

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB(); // Connect to MongoDB

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/vehicle-registration', vehicleRegistrationRequestRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {res.send('Welcome DB');

});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//added by me


