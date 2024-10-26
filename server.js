import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Import routes
import playerRoutes from './routes/playerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Define routes
app.use('/api/players', playerRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Game Leaderboard API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000' }));