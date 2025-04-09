import axios from 'axios';
import { pool } from '../db.js';

export const addSnapshotForCoin = async (coinId, userId) => {
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
    params: { vs_currency: 'usd', ids: coinId }
  });

  const coin = data[0];

  await pool.query(
    `INSERT INTO coin_snapshots (user_id, coin_id, name, symbol, current_price, price_change_percentage_24h)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, coin.id, coin.name, coin.symbol, coin.current_price, coin.price_change_percentage_24h]
  );
};
