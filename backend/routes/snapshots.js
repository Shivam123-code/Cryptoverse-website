import express from 'express';
import axios from 'axios';
import { authenticateUser } from '../middleware/auth.js';
import pg from 'pg';
import { pool as db } from '../db.js';

const router = express.Router();
const { Pool } = pg;

// Setup your database pool connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cryptoverse",
  password: "Shivam@123",
  port: 5432,
});

// POST /api/snapshots/:item_id → create a new snapshot for a coin
router.post('/:coin_id', authenticateUser, async (req, res) => {
    const { coin_id } = req.params;
    const userId = req.user.userId;
  
    try {
      const coinRes = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: { vs_currency: 'usd', ids: coin_id }
      });
  
      if (coinRes.data.length > 0) {
        const coin = coinRes.data[0];
        await db.query(`
            INSERT INTO coin_snapshots (coin_id, name, price, price_change_percentage_24h, user_id)
            VALUES ($1, $2, $3, $4, $5)
          `, [coin.id, coin.name, coin.current_price, coin.price_change_percentage_24h, req.user.userId]);
          
  
        res.status(201).json({ message: 'Snapshot created' });
      } else {
        res.status(404).json({ message: 'Coin not found' });
      }
    } catch (err) {
      console.error('Error creating snapshot:', err);
      res.status(500).json({ error: 'Failed to create snapshot' });
    }
  });

// GET /api/snapshots/:coinId → fetch all snapshots for this user and coin
router.get('/:coinId', authenticateUser, async (req, res) => {
  const { coinId } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM coin_snapshots WHERE user_id = $1 AND item_id = $2 ORDER BY snapshot_time DESC`,
      [userId, coinId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching snapshots:', err.message);
    res.status(500).json({ message: 'Failed to fetch snapshots' });
  }
});

export default router;
