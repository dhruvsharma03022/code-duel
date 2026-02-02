import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class Invite {
  static async create(creatorId, expiryHours = 24) {
    const inviteCode = uuidv4();
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    const result = await query(
      `INSERT INTO invites (creator_id, invite_code, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [creatorId, inviteCode, expiresAt]
    );
    return result.rows[0];
  }

  static async findByCode(inviteCode) {
    const result = await query(
      `SELECT i.*, u.username as creator_username, u.rating as creator_rating
       FROM invites i
       JOIN users u ON i.creator_id = u.id
       WHERE i.invite_code = $1`,
      [inviteCode]
    );
    return result.rows[0];
  }

  static async markAsUsed(inviteCode, matchId) {
    const result = await query(
      `UPDATE invites 
       SET used_at = CURRENT_TIMESTAMP, match_id = $1
       WHERE invite_code = $2
       RETURNING *`,
      [matchId, inviteCode]
    );
    return result.rows[0];
  }

  static async isValid(inviteCode) {
    const invite = await this.findByCode(inviteCode);
    
    if (!invite) {
      return { valid: false, reason: 'Invite not found' };
    }
    
    if (invite.used_at) {
      return { valid: false, reason: 'Invite already used' };
    }
    
    if (new Date(invite.expires_at) < new Date()) {
      return { valid: false, reason: 'Invite expired' };
    }
    
    return { valid: true, invite };
  }

  static async getByCreator(creatorId) {
    const result = await query(
      `SELECT * FROM invites 
       WHERE creator_id = $1 
       ORDER BY created_at DESC`,
      [creatorId]
    );
    return result.rows;
  }

  static async deleteExpired() {
    const result = await query(
      `DELETE FROM invites 
       WHERE expires_at < CURRENT_TIMESTAMP AND used_at IS NULL
       RETURNING *`
    );
    return result.rows;
  }
}

export default Invite;
