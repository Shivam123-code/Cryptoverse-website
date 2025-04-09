router.post('/:item_id', authenticateToken, async (req, res) => {
    const { item_id } = req.params;
    try {
      const coinRes = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: { vs_currency: 'usd', ids: item_id }
      });
  
      if (coinRes.data.length > 0) {
        const coin = coinRes.data[0];
        await pool.query(`
          INSERT INTO coin_snapshots (item_id, name, price, percent_change_24h, user_id)
          VALUES ($1, $2, $3, $4, $5)
        `, [coin.id, coin.name, coin.current_price, coin.price_change_percentage_24h, req.user.id]);
  
        res.status(201).json({ message: 'Snapshot created' });
      } else {
        res.status(404).json({ message: 'Coin not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create snapshot' });
    }
  });
  

  router.get('/:coinId', verifyToken, async (req, res) => {
    const { coinId } = req.params;
    const userId = req.user.id;
  
    try {
      const result = await db.query(
        `SELECT * FROM coin_snapshots WHERE user_id = $1 AND coin_id = $2 ORDER BY snapshot_time DESC`,
        [userId, coinId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching snapshots:', err);
      res.status(500).json({ message: 'Failed to fetch snapshots' });
    }
  });
  