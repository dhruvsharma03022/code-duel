import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, rating, created_at`,
      [username, email, passwordHash]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, username, email, rating, matches_played, matches_won, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateRating(userId, newRating) {
    const result = await query(
      'UPDATE users SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newRating, userId]
    );
    return result.rows[0];
  }

  static async incrementMatchStats(userId, won = false) {
    const result = await query(
      `UPDATE users 
       SET matches_played = matches_played + 1,
           matches_won = matches_won + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [won ? 1 : 0, userId]
    );
    return result.rows[0];
  }

  static async getLeaderboard(limit = 100) {
    const result = await query(
      `SELECT id, username, rating, matches_played, matches_won
       FROM users
       ORDER BY rating DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getMatchHistory(userId, limit = 20) {
    const result = await query(
      `SELECT 
        m.id,
        m.started_at,
        m.completed_at,
        m.winner_id,
        m.duration_seconds,
        p.title as problem_title,
        p.difficulty,
        CASE 
          WHEN m.player1_id = $1 THEN u2.username
          ELSE u1.username
        END as opponent_username,
        CASE 
          WHEN m.player1_id = $1 THEN u2.rating
          ELSE u1.rating
        END as opponent_rating
       FROM matches m
       JOIN problems p ON m.problem_id = p.id
       JOIN users u1 ON m.player1_id = u1.id
       JOIN users u2 ON m.player2_id = u2.id
       WHERE m.player1_id = $1 OR m.player2_id = $1
       ORDER BY m.completed_at DESC NULLS LAST
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }
}

export default User;
