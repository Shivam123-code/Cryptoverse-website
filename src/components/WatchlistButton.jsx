// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const WatchlistButton = ({ itemId, itemType, onAuthRequired }) => {
//   const [isInWatchlist, setIsInWatchlist] = useState(false);

//   useEffect(() => {
//     const checkWatchlist = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         onAuthRequired?.(); // Trigger login modal if available
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:5000/api/watchlist', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const watchlistItems = response.data;
//         const exists = watchlistItems.some(item => item.item_id === itemId);
//         setIsInWatchlist(exists);
//       } catch (error) {
//         console.error('Error checking watchlist:', error.response?.data || error.message);
//         if (error.response?.status === 401) {
//           onAuthRequired?.();
//         }
//       }
//     };

//     checkWatchlist();
//   }, [itemId, onAuthRequired]);

//   const handleSnapshot = async (item_id) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.post(`http://localhost:5000/api/snapshots/${item_id}`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Snapshot taken successfully');
//     } catch (error) {
//       console.error('Snapshot failed:', error);
//       alert('Snapshot failed');
//     }
//   };
  


//   const handleToggleWatchlist = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       onAuthRequired?.(); // If token missing, trigger login
//       return;
//     }

//     try {
//       if (isInWatchlist) {
//         // Remove from watchlist
//         await axios.delete(`http://localhost:5000/api/watchlist/${itemId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setIsInWatchlist(false);
//       } else {
        
        
//         await axios.post(
//           'http://localhost:5000/api/watchlist',
//           {  coin_id: itemId, item_type: itemType },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setIsInWatchlist(true);
//       }
//     } catch (error) {
//       console.error('Error toggling watchlist:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         onAuthRequired?.(); 
//       }
//     }
//   };

//   return (

//     <><button
//       onClick={() => handleSnapshot(coin.id)}
//       className="text-blue-400 hover:text-blue-600 mt-2 text-sm"
//     >
//       Take Snapshot
//     </button><button
//       onClick={handleToggleWatchlist}
//       className={`px-4 py-2 rounded ${isInWatchlist ? 'bg-red-500' : 'bg-blue-500'} text-white transition duration-200`}
//     >
//         {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
//       </button></>
    
//   );
// };

// export default WatchlistButton;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const WatchlistButton = ({ itemId, itemType, onAuthRequired }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        onAuthRequired?.(); // Trigger login modal if available
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const watchlistItems = response.data;
        const exists = watchlistItems.some(item => item.item_id === itemId);
        setIsInWatchlist(exists);
      } catch (error) {
        console.error('Error checking watchlist:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          onAuthRequired?.();
        }
      }
    };

    checkWatchlist();
  }, [itemId, onAuthRequired]);

  const navigate = useNavigate(); // Add at the top

const handleSnapshot = async (item_id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.post(`http://localhost:5000/api/snapshots/${item_id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Snapshot taken successfully');
    navigate(`/Snapshots.jsx/${item_id}`); // Navigate after success
  } catch (error) {
    console.error('Snapshot failed:', error);
    alert('Snapshot failed');
  }
};


  const handleToggleWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onAuthRequired?.(); // If token missing, trigger login
      return;
    }

    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await axios.delete(`http://localhost:5000/api/watchlist/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsInWatchlist(false);
      } else {
        // Add to watchlist
        await axios.post(
          'http://localhost:5000/api/watchlist',
          { coin_id: itemId, item_type: itemType },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        onAuthRequired?.(); 
      }
    }
  };

  return (
    <>
      <button
        onClick={() => handleSnapshot(itemId)}
        className="text-blue-400 hover:text-blue-600 mt-2 text-sm"
      >
        Take Snapshot
      </button>
      <button
        onClick={handleToggleWatchlist}
        className={`px-4 py-2 rounded ${isInWatchlist ? 'bg-red-500' : 'bg-blue-500'} text-white transition duration-200`}
      >
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </>
  );
};

export default WatchlistButton;
