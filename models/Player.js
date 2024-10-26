import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Add an index for sorting by score and name for efficient leaderboard queries
playerSchema.index({ score: -1, name: 1 });

export default mongoose.model('Player', playerSchema);
