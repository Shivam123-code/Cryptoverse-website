import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          withCredentials: true, // Ensures cookies (session) are sent
        });

        if (Array.isArray(response.data)) {
          setWatchlistItems(response.data);
        } else {
          setWatchlistItems([]); // Default to empty array if response is not an array
        }
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  if (loading) return <p>Loading watchlist...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (watchlistItems.length === 0) return <p>No items in your watchlist.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
      <ul>
        {watchlistItems.map((item) => (
          <li key={item.id} className="p-2 border-b">
            {item.item_name || `Item ID: ${item.item_id}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
