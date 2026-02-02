import express from 'express';
import Match from '../models/Match.js';
import Problem from '../models/Problem.js';
import Invite from '../models/Invite.js';
import User from '../models/User.js';
import CodeExecutionService from '../services/codeExecution.js';
import RatingService from '../services/rating.js';
import { auth } from '../middleware/auth.js';
import { io } from '../server.js';

const router = express.Router();

// Join match via invite code
router.post('/join/:inviteCode', auth, async (req, res, next) => {
  try {
    const { inviteCode } = req.params;
    
    // Validate invite
    const validation = await Invite.isValid(inviteCode);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.reason });
    }

    const invite = validation.invite;

    // Check if user is trying to join their own invite
    if (invite.creator_id === req.userId) {
      return res.status(400).json({ error: 'Cannot join your own match' });
    }

    // Check if user already has an active match
    const activeMatch = await Match.getActiveMatchForUser(req.userId);
    if (activeMatch) {
      return res.status(400).json({ 
        error: 'You already have an active match',
        matchId: activeMatch.id 
      });
    }

    // Get random problem
    const problem = await Problem.getRandom();

    // Create match
    const match = await Match.create({
      player1Id: invite.creator_id,
      player2Id: req.userId,
      problemId: problem.id
    });

    // Mark invite as used
    await Invite.markAsUsed(inviteCode, match.id);

    // Notify players via Socket.io
    io.to(`user_${invite.creator_id}`).emit('match_started', {
      matchId: match.id,
      opponent: {
        id: req.user.id,
        username: req.user.username,
        rating: req.user.rating
      }
    });

    res.status(201).json({
      message: 'Match created successfully',
      match: {
        id: match.id,
        player1Id: match.player1_id,
        player2Id: match.player2_id,
        problemId: match.problem_id,
        status: match.status
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get match details
router.get('/:id', auth, async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is part of this match
    if (match.player1_id !== req.userId && match.player2_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Parse test cases if they're still stringified
    let testCases = match.test_cases;
    if (typeof testCases === 'string') {
      testCases = JSON.parse(testCases);
    }

    res.json({
      match: {
        id: match.id,
        status: match.status,
        startedAt: match.started_at,
        completedAt: match.completed_at,
        winnerId: match.winner_id,
        duration: match.duration_seconds,
        player1: {
          id: match.player1_id,
          username: match.player1_username,
          rating: match.player1_rating
        },
        player2: {
          id: match.player2_id,
          username: match.player2_username,
          rating: match.player2_rating
        },
        problem: {
          id: match.problem_id,
          title: match.title,
          description: match.description,
          difficulty: match.difficulty,
          testCases: testCases,
          constraints: match.constraints,
          timeLimit: match.time_limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Submit solution
router.post('/:id/submit', auth, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const matchId = req.params.id;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Get match details
    const match = await Match.findById(matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is part of this match
    if (match.player1_id !== req.userId && match.player2_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if match is still in progress
    if (match.status !== 'in_progress') {
      return res.status(400).json({ error: 'Match is not in progress' });
    }

    // Update submission
    await Match.updateSubmission(matchId, req.userId, code, language);

    // Parse test cases
    let testCases = match.test_cases;
    if (typeof testCases === 'string') {
      testCases = JSON.parse(testCases);
    }

    // Run test cases
    const testResults = await CodeExecutionService.runTestCases(
      code,
      language,
      testCases
    );

    // If all tests passed, declare winner
    if (testResults.allPassed) {
      // Get both players' data
      const player1 = await User.findById(match.player1_id);
      const player2 = await User.findById(match.player2_id);

      // Calculate new ratings
      const isPlayer1Winner = req.userId === match.player1_id;
      const winnerRating = isPlayer1Winner ? player1.rating : player2.rating;
      const loserRating = isPlayer1Winner ? player2.rating : player1.rating;

      const ratingChanges = RatingService.calculateEloRatings(
        winnerRating,
        loserRating
      );

      const newPlayer1Rating = isPlayer1Winner 
        ? ratingChanges.newWinnerRating 
        : ratingChanges.newLoserRating;
      const newPlayer2Rating = isPlayer1Winner 
        ? ratingChanges.newLoserRating 
        : ratingChanges.newWinnerRating;

      // Complete match with transaction
      await Match.completeMatch(
        matchId,
        req.userId,
        newPlayer1Rating,
        newPlayer2Rating
      );

      // Notify both players
      const winnerChange = isPlayer1Winner 
        ? ratingChanges.winnerChange 
        : ratingChanges.loserChange;
      const loserChange = isPlayer1Winner 
        ? ratingChanges.loserChange 
        : ratingChanges.winnerChange;

      const opponentId = req.userId === match.player1_id 
        ? match.player2_id 
        : match.player1_id;

      io.to(`match_${matchId}`).emit('match_completed', {
        winnerId: req.userId,
        winnerUsername: req.user.username,
        winnerRatingChange: winnerChange,
        loserRatingChange: loserChange
      });

      return res.json({
        success: true,
        message: 'Congratulations! You won the match!',
        testResults,
        ratingChange: winnerChange,
        newRating: isPlayer1Winner ? newPlayer1Rating : newPlayer2Rating
      });
    }

    // Tests didn't pass
    res.json({
      success: false,
      message: 'Some tests failed',
      testResults
    });
  } catch (error) {
    next(error);
  }
});

// Get active match for current user
router.get('/me/active', auth, async (req, res, next) => {
  try {
    const match = await Match.getActiveMatchForUser(req.userId);
    
    if (!match) {
      return res.json({ match: null });
    }

    const fullMatch = await Match.findById(match.id);

    res.json({
      match: {
        id: fullMatch.id,
        status: fullMatch.status,
        problemId: fullMatch.problem_id
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
