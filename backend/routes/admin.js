import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// GET /admin/stats
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const totalUsersQuery = await pool.query('SELECT COUNT(*) FROM users');
    const totalPostsQuery = await pool.query('SELECT COUNT(*) FROM posts');
    const totalWatchlistQuery = await pool.query('SELECT COUNT(*) FROM watchlist');

    res.json({
      totalUsers: parseInt(totalUsersQuery.rows[0].count),
      totalPosts: parseInt(totalPostsQuery.rows[0].count),
      totalWatchlistItems: parseInt(totalWatchlistQuery.rows[0].count),
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/users
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const usersQuery = await pool.query(`
      SELECT id, email, created_at, last_sign_in_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(usersQuery.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
