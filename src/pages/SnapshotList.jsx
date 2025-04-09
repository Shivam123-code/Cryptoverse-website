// src/pages/SnapshotList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SnapshotList = () => {
  const [snapshots, setSnapshots] = useState([]);

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Snapshots</h1>
      {snapshots.length === 0 ? (
        <p>No snapshots found.</p>
      ) : (
        <ul className="space-y-2">
          {snapshots.map((snap, index) => (
            <li key={index} className="border p-3 rounded bg-gray-800">
              <p><strong>Coin ID:</strong> {snap.coin_id}</p>
              <p><strong>Price:</strong> ${snap.price}</p>
              <p><strong>Change 24h:</strong> {snap.price_change_24h}%</p>
              <p><strong>Market Cap:</strong> ${snap.market_cap}</p>
              <p><strong>Snapshot Time:</strong> {new Date(snap.snapshot_time).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SnapshotList;
