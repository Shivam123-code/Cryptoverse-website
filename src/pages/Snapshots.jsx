import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Snapshots = () => {
  const { itemId } = useParams();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshots = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view snapshots');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/snapshots/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSnapshots(res.data);
      } catch (err) {
        console.error('Error fetching snapshots:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [itemId]);

  if (loading) return <div className="p-4">Loading snapshots...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Snapshots for: {itemId}</h2>
      {snapshots.length === 0 ? (
        <p>No snapshots found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">% Change (24h)</th>
              <th className="border px-4 py-2">Snapshot Time</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snap) => (
              <tr key={snap.id}>
                <td className="border px-4 py-2">{snap.name}</td>
                <td className="border px-4 py-2">${snap.price}</td>
                <td className="border px-4 py-2">{snap.price_change_percentage_24h}%</td>
                <td className="border px-4 py-2">
                  {new Date(snap.snapshot_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Snapshots;
