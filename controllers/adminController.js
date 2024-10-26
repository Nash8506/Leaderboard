import Player from '../models/Player.js';
import User from '../models/User.js';

// Get the top 10 players for admin
export const getLeaderboard = async (req, res) => {
  try {
    const players = await Player.find({})
      .sort({ score: -1, name: 1 })
      .limit(10);

    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      score: player.score,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for a player by name or ID
export const searchPlayer = async (req, res) => {
  const { name, id } = req.query;

  try {
    let player;

    if (id) {
      player = await Player.findOne({ user: id });
    } else if (name) {
      player = await Player.findOne({ name: { $regex: name, $options: 'i' } });
    }

    if (player) {
      // Get player rank if they're in the leaderboard
      const rank = await Player.countDocuments({ score: { $gt: player.score } }) + 1;
      res.json({
        rank,
        name: player.name,
        score: player.score,
      });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update any player's score by admin
export const updateScoreByAdmin = async (req, res) => {
  const playerId = req.params.id;
  const { score } = req.body;

  try {
    const player = await Player.findOneAndUpdate(
      { user: playerId },
      { score },
      { new: true }
    );

    if (player) {
      res.json({
        message: 'Score updated successfully',
        player,
      });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
