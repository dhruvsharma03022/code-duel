import express from 'express';
import User from '../models/User.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import RatingService from '../services/rating.js';

const router = express.Router();

// Get user profile
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matchHistory = await User.getMatchHistory(user.id, 10);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        rating: user.rating,
        rank: RatingService.getRankName(user.rating),
        matchesPlayed: user.matches_played,
        matchesWon: user.matches_won,
        winRate: user.matches_played > 0 
          ? Math.round((user.matches_won / user.matches_played) * 100) 
          : 0,
        createdAt: user.created_at
      },
      recentMatches: matchHistory
    });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const leaderboard = await User.getLeaderboard(limit);

    const enrichedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      rating: user.rating,
      tier: RatingService.getRankName(user.rating),
      matchesPlayed: user.matches_played,
      matchesWon: user.matches_won,
      winRate: user.matches_played > 0 
        ? Math.round((user.matches_won / user.matches_played) * 100) 
        : 0
    }));

    res.json({
      leaderboard: enrichedLeaderboard,
      total: enrichedLeaderboard.length
    });
  } catch (error) {
    next(error);
  }
});

// Get match history for authenticated user
router.get('/me/history', auth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await User.getMatchHistory(req.userId, limit);

    res.json({
      matches: history,
      total: history.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
