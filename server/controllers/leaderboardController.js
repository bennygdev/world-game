const { pool } = require('../db/db');

const getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.score, s.game_mode, s.played_at, u.username
       FROM scores s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.score DESC
       LIMIT 100`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

module.exports = { getLeaderboard };