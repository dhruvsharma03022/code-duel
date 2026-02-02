import express from 'express';
import Problem from '../models/Problem.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all problems (list view)
router.get('/', async (req, res, next) => {
  try {
    const problems = await Problem.getAll();
    res.json({ problems });
  } catch (error) {
    next(error);
  }
});

// Get problem by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Parse test cases if needed
    let testCases = problem.test_cases;
    if (typeof testCases === 'string') {
      testCases = JSON.parse(testCases);
    }

    res.json({
      problem: {
        id: problem.id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        testCases: testCases,
        constraints: problem.constraints,
        timeLimit: problem.time_limit,
        memoryLimit: problem.memory_limit
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get random problem
router.get('/random/get', async (req, res, next) => {
  try {
    const difficulty = req.query.difficulty;
    
    const problem = difficulty 
      ? await Problem.getRandomByDifficulty(difficulty)
      : await Problem.getRandom();

    if (!problem) {
      return res.status(404).json({ error: 'No problems found' });
    }

    res.json({ problem });
  } catch (error) {
    next(error);
  }
});

export default router;
