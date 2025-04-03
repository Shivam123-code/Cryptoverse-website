import axios from 'axios';

const API_URL = 'http://localhost:5000';


// Register
export const register = async (username, email, password) => {
    return await axios.post(`${API_URL}/register`, { username, email, password }, { withCredentials: true });
};

// Login
export const login = async (email, password) => {
    return await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
};

// Logout
export const logout = async () => {
    return await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

// Get Current User
export const getCurrentUser = async () => {
    return await axios.get(`${API_URL}/me`, { withCredentials: true });
};
