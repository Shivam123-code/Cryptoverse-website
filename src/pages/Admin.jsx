
import React, { useEffect, useState } from 'react';
import { AlertCircle, Users, MessageSquare, Star, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAllUsers, deleteUser } from '../services/admin';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalWatchlistItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin, token } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getAllUsers()
      ]);

      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data. Make sure you have the correct permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(id); // Call the deleteUser function from services/admin.js
      setUsers((prev) => prev.filter((u) => u.id !== id)); // Remove user from state
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 })); // Update total users count
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Error deleting user.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Watchlist Items</p>
              <p className="text-2xl font-bold">{stats.totalWatchlistItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Last Sign In</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
  {user.created_at 
    ? new Date(user.created_at).toLocaleDateString() 
    : 'N/A'}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
  {user.last_sign_in_at 
    ? new Date(user.last_sign_in_at).toLocaleDateString() 
    : 'Never'}
</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
