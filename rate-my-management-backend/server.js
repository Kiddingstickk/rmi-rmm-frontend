const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


// Load env variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// DB config
const connectDB = require('./config/db');

// App setup
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

app.get('/', (req, res) => {
    res.send('Backend is running and connected to MongoDB!');
  });
  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/reviews', reviewRoutes);


app.get('/test', (req, res) => {
    res.json({ message: 'Test route working!' });
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
