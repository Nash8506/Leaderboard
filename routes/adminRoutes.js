import express from 'express';
import { getLeaderboard, searchPlayer, updateScoreByAdmin } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get top 10 players on the leaderboard (admin access)
router.get('/leaderboard', protect, admin, getLeaderboard);

// Route to search for a player by name or ID (admin access)
router.get('/search', protect, admin, searchPlayer);

// Route to update any player's score (admin access)
router.put('/update-score/:id', protect, admin, updateScoreByAdmin);

export default router;
