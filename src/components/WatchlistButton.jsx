import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WatchlistButton = ({ itemId, itemType, onAuthRequired }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        onAuthRequired?.(); // Trigger login modal if passed
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    const token = localStorage.getItem('token');
    if (!token) {
      onAuthRequired?.();
      return;
    }

    try {
      if (isInWatchlist) {
        await axios.delete(`http://localhost:5000/api/watchlist/${itemId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsInWatchlist(false);
      } else {
        await axios.post(
          'http://localhost:5000/api/watchlist',
          { item_id: itemId, item_type: itemType },
          {withCredentials: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsInWatchlist(true);
      }
    }catch (error) {
      console.error('Error toggling watchlist:', error.response?.data || error.message || error);
      if (error.response?.status === 401) {
        onAuthRequired?.(); // Optional chaining
      }
    }
    
  };

  return (
    <button
      onClick={handleToggleWatchlist}
      className={`px-4 py-2 rounded ${
        isInWatchlist ? 'bg-red-500' : 'bg-blue-500'
      } text-white`}
    >
      {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;
