
  
  export default Admin;
  import axios from './axios'; // or adjust path based on your setup

export const getAdminStats = async () => {
  const res = await axios.get('/admin/stats');
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get('/admin/users');
  return res.data;
};
