import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SnapshotList = () => {
  const [snapshots, setSnapshots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnapshots = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/snapshots', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnapshots(res.data);
      } catch (err) {
        console.error('Failed to fetch snapshots:', err);
      }
    };

    fetchSnapshots();
  }, []);

  const handleCardClick = (coinId) => {
    navigate(`/coins/${coinId}`);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">📸 Your Coin Snapshots</h1>

      {snapshots.length === 0 ? (
        <div className="text-center text-gray-400">No snapshots found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map((snap, index) => (
            <div
              key={index}
              className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 hover:border-indigo-500 transition duration-200 cursor-pointer hover:scale-105"
              onClick={() => handleCardClick(snap.coin_id)}
            >
              <h2 className="text-xl font-semibold mb-2 text-indigo-300">{snap.name || snap.coin_id}</h2>
              <p>
                <strong>💰 Price:</strong>{' '}
                {snap.price ? `$${Number(snap.price).toFixed(2)}` : 'N/A'}
              </p>
              <p>
                <strong>📈 24h Change:</strong>{' '}
                <span
                  className={
                    Number(snap.price_change_percentage_24h) >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {snap.price_change_percentage_24h !== null && snap.price_change_percentage_24h !== undefined
                    ? `${Number(snap.price_change_percentage_24h).toFixed(2)}%`
                    : 'N/A'}
                </span>
              </p>
              {snap.market_cap && (
                <p>
                  <strong>🏦 Market Cap:</strong>{' '}
                  ${Number(snap.market_cap).toLocaleString()}
                </p>
              )}
              <p>
                <strong>🕒 Snapshot Time:</strong>{' '}
                {new Date(snap.snapshot_time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnapshotList;
