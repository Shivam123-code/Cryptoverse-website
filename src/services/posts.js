

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
