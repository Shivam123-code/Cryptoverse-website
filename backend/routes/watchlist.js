import express from 'express';
import { pool } from '../db.js'; 
import { authenticateUser } from '../middleware/auth.js';
import fetch from 'node-fetch';
import { addSnapshotForCoin } from '../utils/snapshot.js';

const router = express.Router();

router.post('/', authenticateUser, async (req, res) => {
  const { item_id } = req.body;
  const userId = req.user.id;

  try {
    // 1. Add to watchlist
    await db.query('INSERT INTO watchlist (user_id, item_id) VALUES ($1, $2)', [userId, item_id]);

    // 2. Create snapshot
    await addSnapshotForCoin(item_id, userId);

    res.status(201).json({ message: 'Coin added to watchlist and snapshot stored' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Failed to add to watchlist' });
  }
});


router.post('/snapshot', async (req, res) => {
  const userId = req.user.id; // assuming you're using JWT auth middleware
  const { coinId } = req.body;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
    );
    const data = await response.json();
    const coin = data[0];

    const insertQuery = `
      INSERT INTO coin_snapshots (user_id, coin_id, name, price, price_change_percentage_24h)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [
      userId,
      coin.id,
      coin.name,
      coin.current_price,
      coin.price_change_percentage_24h,
    ]);

    res.status(201).json({ message: 'Snapshot stored!' });
  } catch (err) {
    console.error('Error storing snapshot:', err);
    res.status(500).json({ message: 'Failed to store snapshot' });
  }
});


// Get user's watchlist
router.get('/watchlist', authenticateUser, async (req, res) => {
    try {
      const { userId } = req.user;
      const result = await pool.query(
        'SELECT * FROM watchlist WHERE user_id = $1',
        [userId]
      );
  
      if (!result.rows || result.rows.length === 0) {
        return res.json([]);
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
        const {  coin_id, item_type } = req.body;
if (! coin_id || !item_type) {
  return res.status(400).json({ message: 'Missing item_id or item_type' });
}

        const exists = await pool.query(
            'SELECT * FROM watchlist WHERE user_id = $1 AND item_id = $2',
            [userId,  coin_id]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ error: 'Item already in watchlist' });
        }

        await pool.query(
            'INSERT INTO watchlist (user_id, item_id, item_type) VALUES ($1, $2, $3)',
            [userId,  coin_id, item_type]
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
