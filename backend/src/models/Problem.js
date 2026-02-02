import { query } from '../config/database.js';

class Problem {
  static async findById(id) {
    const result = await query(
      'SELECT * FROM problems WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await query(
      'SELECT id, title, difficulty FROM problems ORDER BY id'
    );
    return result.rows;
  }

  static async getByDifficulty(difficulty) {
    const result = await query(
      'SELECT * FROM problems WHERE difficulty = $1',
      [difficulty]
    );
    return result.rows;
  }

  static async getRandom() {
    const result = await query(
      'SELECT * FROM problems ORDER BY RANDOM() LIMIT 1'
    );
    return result.rows[0];
  }

  static async getRandomByDifficulty(difficulty) {
    const result = await query(
      'SELECT * FROM problems WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1',
      [difficulty]
    );
    return result.rows[0];
  }

  static async create({ title, description, difficulty, testCases, constraints, timeLimit = 2000, memoryLimit = 256 }) {
    const result = await query(
      `INSERT INTO problems (title, description, difficulty, test_cases, constraints, time_limit, memory_limit)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, difficulty, JSON.stringify(testCases), constraints, timeLimit, memoryLimit]
    );
    return result.rows[0];
  }
}

export default Problem;
