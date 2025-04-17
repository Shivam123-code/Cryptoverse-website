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

export const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};



export const getAllPosts = async () => {
  const res = await axios.get('/api/admin/posts');
  return res.data;
};

