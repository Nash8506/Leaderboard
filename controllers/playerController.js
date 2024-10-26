import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Player from '../models/Player.js';

dotenv.config();

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new player
export const registerPlayer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new User (player role by default)
    const user = await User.create({
      name,
      email,
      password,
      role: 'player',
    });

    // Create a Player profile linked to the user
    await Player.create({
      user: user._id,
      name: user.name,
      score: 0,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in a player
export const loginPlayer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password)) && user.role === 'player') {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update player's own score
export const updateScore = async (req, res) => {
  const playerId = req.params.id;
  const { score } = req.body;

  if (req.user._id.toString() !== playerId) {
    return res.status(403).json({ message: 'You can only update your own score' });
  }

  try {
    const player = await Player.findOneAndUpdate(
      { user: playerId },
      { score },
      { new: true }
    );

    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get top 10 players on the leaderboard
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
