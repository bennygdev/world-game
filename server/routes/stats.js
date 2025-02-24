const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { saveGameStats, getUserStats } = require('../controllers/statsController');

router.post('/saveStats', authenticateToken, saveGameStats);
router.get('/stats', authenticateToken, getUserStats);

module.exports = router;