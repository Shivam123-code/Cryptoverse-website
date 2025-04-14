import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { isAdmin } from '../middleware/isAdmin.js';
import pool from '../db.js';

const router = express.Router();

// Route 1: Get Admin Stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalPosts = await pool.query('SELECT COUNT(*) FROM posts');
    const totalWatchlistItems = await pool.query('SELECT COUNT(*) FROM watchlist');

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalPosts: parseInt(totalPosts.rows[0].count),
      totalWatchlistItems: parseInt(totalWatchlistItems.rows[0].count),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route 2: Get All Users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, created_at, last_sign_in_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
