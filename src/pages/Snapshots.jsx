import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Snapshots = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSnapshots = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Not logged in');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/snapshots', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnapshots(response.data);
      } catch (err) {
        console.error('Error fetching snapshots:', err);
        setError('Failed to fetch snapshots');
      }
    };

    fetchSnapshots();
  }, []);

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Snapshots</h1>
      {snapshots.length === 0 ? (
        <p>No snapshots available.</p>
      ) : (
        <table className="min-w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 border-b">Coin</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">% Change (24h)</th>
              <th className="px-4 py-2 border-b">Time</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snap, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2">{snap.coin_id}</td>
                <td className="px-4 py-2">${snap.price}</td>
                <td className="px-4 py-2">{snap.price_change_24h}%</td>
                <td className="px-4 py-2">{new Date(snap.snapshot_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Snapshots;
