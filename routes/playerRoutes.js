import express from 'express';
import { registerPlayer, loginPlayer, updateScore, getLeaderboard } from '../controllers/playerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to register a new player
router.post('/register', registerPlayer);

// Route to login a player
router.post('/login', loginPlayer);

// Route to update player score (requires authentication)
router.put('/update-score/:id', protect, updateScore);

// Route to get top 10 players on the leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;
