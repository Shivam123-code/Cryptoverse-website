import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {pool} from '../db.js';

const router = express.Router();

//  Get Admin Stats
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
    const result = await pool.query(`
      SELECT id, email, username, is_admin, created_at, last_sign_in_at 
      FROM users
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route to delete a user by ID
router.delete('/user/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    // First, delete the user from the database
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    // Send success response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Route to get all posts (without GROUP BY)
router.get('/posts', async (req, res) => { // Temporarily remove authenticateToken and isAdmin
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        u.id AS user_id,
        u.email
      FROM posts p
      JOIN users u ON p.user_id = u.id
    `);
    res.json(result.rows);  // Send all posts without grouping
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





export default router;
