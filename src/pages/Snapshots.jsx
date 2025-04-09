import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Snapshots = () => {
  const { itemId } = useParams();
  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/snapshots/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setSnapshots(res.data))
    .catch(err => console.error(err));
  }, [itemId]);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Snapshot History for {itemId}</h2>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>% Change (24h)</th>
            <th>Snapshot Time</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snap, index) => (
            <tr key={index}>
              <td>{snap.name}</td>
              <td>${snap.price}</td>
              <td>{snap.percent_change_24h}%</td>
              <td>{new Date(snap.snapshot_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Snapshots;
