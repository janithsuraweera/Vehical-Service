const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');//authorizes the server to accept JSON data in a POST request
const inventoryRoutes = require('./routes/inventoryRoutes');



require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // Connect to MongoDB


app.use('/api/inventory', inventoryRoutes);
app.get('/', (req, res) => {res.send('Hello World!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//added by me


