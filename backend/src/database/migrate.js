import pool from '../config/database.js';

const createTables = async () => {
  try {
    console.log('🔧 Starting database migration...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rating INTEGER DEFAULT 1200,
        matches_played INTEGER DEFAULT 0,
        matches_won INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create index on username and email for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating DESC);
    `);

    // Problems table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS problems (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
        test_cases JSONB NOT NULL,
        constraints TEXT,
        time_limit INTEGER DEFAULT 2000,
        memory_limit INTEGER DEFAULT 256,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Problems table created');

    // Invites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invites (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invite_code VARCHAR(100) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        match_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Invites table created');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(invite_code);
      CREATE INDEX IF NOT EXISTS idx_invites_creator ON invites(creator_id);
    `);

    // Matches table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        player1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        player2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
        winner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        player1_submission TEXT,
        player2_submission TEXT,
        player1_language VARCHAR(50),
        player2_language VARCHAR(50),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        duration_seconds INTEGER,
        status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed', 'abandoned'))
      );
    `);
    console.log('✅ Matches table created');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_matches_player1 ON matches(player1_id);
      CREATE INDEX IF NOT EXISTS idx_matches_player2 ON matches(player2_id);
      CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches(winner_id);
      CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
    `);

    // Rating history table (optional - for tracking rating changes)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rating_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        old_rating INTEGER NOT NULL,
        new_rating INTEGER NOT NULL,
        rating_change INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Rating history table created');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_rating_history_user ON rating_history(user_id);
    `);

    console.log('🎉 Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

createTables();
