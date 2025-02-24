const { pool } = require('../db/db');

// save after a game
const saveGameStats = async (req, res) => {
  const { game_mode, score } = req.body;
  const user = req.user;
  
  try {
    // only save for authenticated users
    if (!user) {
      return res.json({ success: true, message: 'Guest game completed' });
    }

    // update scores if new score is higher, otherwise insert new record
    const result = await pool.query(
      `INSERT INTO scores (user_id, game_mode, score)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, game_mode)
       DO UPDATE SET 
         score = CASE 
           WHEN scores.score < EXCLUDED.score THEN EXCLUDED.score 
           ELSE scores.score 
         END,
         played_at = CASE 
           WHEN scores.score < EXCLUDED.score THEN CURRENT_TIMESTAMP 
           ELSE scores.played_at 
         END
       RETURNING *`,
      [user.userId, game_mode, score]
    );

    // update user stats
    await pool.query(
      `INSERT INTO user_stats (user_id, game_mode, total_games_played, last_played)
       VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, game_mode)
       DO UPDATE SET 
         total_games_played = user_stats.total_games_played + 1,
         last_played = CURRENT_TIMESTAMP
       RETURNING *`,
      [user.userId, game_mode]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving game stats:', error);
    res.status(500).json({ error: 'Failed to save game stats' });
  }
};

// retrieve user statistics
const getUserStats = async (req, res) => {
  const user = req.user;

  try {
    const stats = await pool.query(
      `SELECT 
         s.game_mode,
         s.score as high_score,
         us.total_games_played,
         us.best_streak,
         us.last_played
       FROM scores s
       LEFT JOIN user_stats us ON 
         us.user_id = s.user_id AND 
         us.game_mode = s.game_mode
       WHERE s.user_id = $1`,
      [user.userId]
    );

    res.json(stats.rows);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

module.exports = {
  saveGameStats,
  getUserStats
};