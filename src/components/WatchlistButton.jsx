import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WatchlistButton = ({ itemId, itemType, onAuthRequired }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          withCredentials: true, // Ensures cookies (session) are sent
        });
        const watchlistItems = response.data;
        setIsInWatchlist(watchlistItems.some(item => item.item_id === itemId));
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };

    checkWatchlist();
  }, [itemId]);

  const handleToggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await axios.delete(`http://localhost:5000/api/watchlist/${itemId}`, {
          withCredentials: true,
        });
        setIsInWatchlist(false);
      } else {
        await axios.post(
          'http://localhost:5000/api/watchlist',
          { itemId, itemType },
          { withCredentials: true }
        );
        setIsInWatchlist(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        onAuthRequired(); // Trigger authentication modal if not logged in
      }
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <button
      onClick={handleToggleWatchlist}
      className={`px-4 py-2 rounded ${isInWatchlist ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
    >
      {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;
