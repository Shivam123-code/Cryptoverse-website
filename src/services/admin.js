import axios from 'axios';

export const getAdminStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:5000/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:5000/api/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
