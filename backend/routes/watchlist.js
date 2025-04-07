import express from 'express';
import { pool } from '../db.js'; 
import { authenticateUser } from '../middleware/auth.js';


const router = express.Router();

// Get user's watchlist
router.get('/watchlist', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.user;
        const result = await pool.query('SELECT * FROM watchlist WHERE user_id = $1', [userId]);

        if (!result.rows || result.rows.length === 0) {
            return res.json([]); // Return empty array instead of null
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

// Add item to watchlist
router.post('/watchlist', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.user;
        const { item_id, item_type } = req.body;
if (!item_id || !item_type) {
  return res.status(400).json({ message: 'Missing item_id or item_type' });
}

        const exists = await pool.query(
            'SELECT * FROM watchlist WHERE user_id = $1 AND item_id = $2',
            [userId, item_id]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ error: 'Item already in watchlist' });
        }

        await pool.query(
            'INSERT INTO watchlist (user_id, item_id, item_type) VALUES ($1, $2, $3)',
            [userId, item_id, item_type]
        );

        res.json({ message: 'Item added to watchlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// Remove item from watchlist
router.delete('/watchlist/:id', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        await pool.query(
            'DELETE FROM watchlist WHERE user_id = $1 AND id = $2',
            [userId, id]
        );

        res.json({ message: 'Item removed from watchlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

export default router;
