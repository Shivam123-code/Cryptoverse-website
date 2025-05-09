import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = response.data || [];
        setWatchlistItems(items);

        // Fetch coin details
        const coinIds = items.map(item => item.item_id).join(',');
        if (coinIds) {
          const coinRes = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets`,
            {
              params: { vs_currency: 'usd', ids: coinIds },
            }
          );
          setCoinDetails(coinRes.data);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Delete handler
  const handleDelete = async (item_id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${item_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update both states
      setCoinDetails(prev => prev.filter(coin => coin.id !== item_id));
      setWatchlistItems(prev => prev.filter(item => item.item_id !== item_id));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete from watchlist');
    }
  };
  

  // 📸 Manual snapshot handler
  const handleManualSnapshot = async (coinId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post('http://localhost:5000/api/snapshots', { coinId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Snapshot stored for ${coinId}`);
    } catch (err) {
      console.error('Snapshot error:', err);
      alert('Failed to take snapshot');
    }
  };

  if (loading) return <p className="text-white">Loading watchlist...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (coinDetails.length === 0) return <p className="text-white">No items in your watchlist.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Watchlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coinDetails.map((coin) => (
          <div key={coin.id} className="relative group">
            {/* Card Content wrapped with Link */}
            <Link
              to={`/coins/${coin.id}`}
              className="bg-[#1e293b] text-white rounded-lg p-4 shadow-md hover:bg-[#334155] transition duration-200 block"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{coin.name}</p>
                    <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p>${coin.current_price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">24h change</p>
                  <p className={coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Link>

            {/* Buttons positioned over card (not part of the Link) */}
            <div className="absolute top-2 right-2 flex space-x-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete(coin.id);
                }}
                className="text-red-400 hover:text-red-600"
                title="Delete from Watchlist"
              >
                <i className="fas fa-trash-alt" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleManualSnapshot(coin.id);
                }}
                className="text-blue-400 hover:text-blue-600"
                title="Take Snapshot"
              >
                <i className="fas fa-camera" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
