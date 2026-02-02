import { query, transaction } from '../config/database.js';

class Match {
  static async create({ player1Id, player2Id, problemId }) {
    const result = await query(
      `INSERT INTO matches (player1_id, player2_id, problem_id, status)
       VALUES ($1, $2, $3, 'in_progress')
       RETURNING *`,
      [player1Id, player2Id, problemId]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT m.*, 
        p.title, p.description, p.difficulty, p.test_cases, p.constraints, p.time_limit,
        u1.username as player1_username, u1.rating as player1_rating,
        u2.username as player2_username, u2.rating as player2_rating
       FROM matches m
       JOIN problems p ON m.problem_id = p.id
       JOIN users u1 ON m.player1_id = u1.id
       JOIN users u2 ON m.player2_id = u2.id
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async updateSubmission(matchId, playerId, code, language) {
    const match = await this.findById(matchId);
    
    const isPlayer1 = match.player1_id === playerId;
    const columnName = isPlayer1 ? 'player1_submission' : 'player2_submission';
    const langColumnName = isPlayer1 ? 'player1_language' : 'player2_language';

    const result = await query(
      `UPDATE matches 
       SET ${columnName} = $1, ${langColumnName} = $2
       WHERE id = $3
       RETURNING *`,
      [code, language, matchId]
    );
    return result.rows[0];
  }

  static async setWinner(matchId, winnerId) {
    const result = await query(
      `UPDATE matches 
       SET winner_id = $1, 
           completed_at = CURRENT_TIMESTAMP,
           duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)),
           status = 'completed'
       WHERE id = $2
       RETURNING *`,
      [winnerId, matchId]
    );
    return result.rows[0];
  }

  static async updateStatus(matchId, status) {
    const result = await query(
      'UPDATE matches SET status = $1 WHERE id = $2 RETURNING *',
      [status, matchId]
    );
    return result.rows[0];
  }

  static async getActiveMatchForUser(userId) {
    const result = await query(
      `SELECT * FROM matches 
       WHERE (player1_id = $1 OR player2_id = $1) 
       AND status IN ('waiting', 'in_progress')
       ORDER BY started_at DESC
       LIMIT 1`,
      [userId]
    );
    return result.rows[0];
  }

  static async completeMatch(matchId, winnerId, player1Rating, player2Rating) {
    return await transaction(async (client) => {
      // Update match
      const matchResult = await client.query(
        `UPDATE matches 
         SET winner_id = $1, 
             completed_at = CURRENT_TIMESTAMP,
             duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)),
             status = 'completed'
         WHERE id = $2
         RETURNING *`,
        [winnerId, matchId]
      );
      const match = matchResult.rows[0];

      // Get old ratings
      const player1Result = await client.query(
        'SELECT rating FROM users WHERE id = $1',
        [match.player1_id]
      );
      const player2Result = await client.query(
        'SELECT rating FROM users WHERE id = $1',
        [match.player2_id]
      );

      const oldPlayer1Rating = player1Result.rows[0].rating;
      const oldPlayer2Rating = player2Result.rows[0].rating;

      // Update player ratings
      await client.query(
        'UPDATE users SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [player1Rating, match.player1_id]
      );
      await client.query(
        'UPDATE users SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [player2Rating, match.player2_id]
      );

      // Update match stats
      await client.query(
        `UPDATE users 
         SET matches_played = matches_played + 1,
             matches_won = matches_won + CASE WHEN id = $1 THEN 1 ELSE 0 END
         WHERE id IN ($2, $3)`,
        [winnerId, match.player1_id, match.player2_id]
      );

      // Record rating history
      await client.query(
        `INSERT INTO rating_history (user_id, match_id, old_rating, new_rating, rating_change)
         VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)`,
        [
          match.player1_id, matchId, oldPlayer1Rating, player1Rating, player1Rating - oldPlayer1Rating,
          match.player2_id, matchId, oldPlayer2Rating, player2Rating, player2Rating - oldPlayer2Rating
        ]
      );

      return match;
    });
  }
}

export default Match;
