const jwt = require('jsonwebtoken');
const { redisClient } = require('../db/db');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify if session exists in Redis
    const sessionToken = await redisClient.get(`session:${decoded.userId}`);
    if (!sessionToken || sessionToken !== token) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };