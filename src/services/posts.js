import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/posts';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPosts = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createPost = async (postData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const response = await axios.post(API_BASE_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updatePost = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
