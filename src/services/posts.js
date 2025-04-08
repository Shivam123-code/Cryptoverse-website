// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api/posts';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };


// export const getPosts = async () => {
//   const response = await axios.get(API_BASE_URL);
//   return response.data;
// };

// export const createPost = async (postData) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Not authenticated');

//   const response = await axios.post(API_BASE_URL, postData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

// export const updatePost = async (id, data) => {
//   const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
//     headers: getAuthHeaders(),
//   });
//   return response.data;
// };

// export const deletePost = async (id) => {
//   const response = await axios.delete(`${API_BASE_URL}/${id}`, {
//     headers: getAuthHeaders(),
//   });
//   return response.data;
// };


import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/posts'; // adjust if your port is different

export const getPosts = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const createPost = async (post) => {
  const response = await axios.post(API_BASE, post);
  return response.data;
};

export const updatePost = async (id, updatedPost) => {
  const response = await axios.put(`${API_BASE}/${id}`, updatedPost);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};
