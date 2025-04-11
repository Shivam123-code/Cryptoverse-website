import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js'; // ✅ Fix here
import { pool as db } from '../db.js'; // ✅ Use this

const router = express.Router();

// POST /api/snapshots/:coin_id → create a new snapshot for a coin
router.post('/:coin_id', authenticateToken, async (req, res) => {
  console.log("📥 POST /snapshots hit by:", req.user, req.params.coin_id);
  const { coin_id } = req.params;

  try {
    const coinRes = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
      params: { vs_currency: 'usd', ids: coin_id }
    });

    if (coinRes.data.length > 0) {
      const coin = coinRes.data[0];
      await db.query(
        `INSERT INTO coin_snapshots (coin_id, name, price, price_change_percentage_24h, user_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [coin.id, coin.name, coin.current_price, coin.price_change_percentage_24h, req.user.id] // 👈 fix here
      );
      

      res.status(201).json({ message: 'Snapshot created' });
    } else {
      res.status(404).json({ message: 'Coin not found' });
    }
  } catch (err) {
    console.error('Error creating snapshot:', err);
    res.status(500).json({ error: 'Failed to create snapshot' });
  }
});

// ✅ GET all snapshots for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM coin_snapshots WHERE user_id = $1 ORDER BY snapshot_time DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
