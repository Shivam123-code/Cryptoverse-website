
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🚀 Fetch user data using JWT
  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // ✅ Read token
  
      const res = await fetch('http://localhost:5000/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
      });
  
      const data = await res.json();
      console.log("Session check:", res.status, data);
  
      if (res.ok) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Session fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  // 🚀 Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
  
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      console.log("Login response:", res.status, data); // Debugging
  
      if (res.ok) {
        localStorage.setItem('token', data.token); // ✅ Save token
        setUser(data.user); // ✅ Store user info
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };
  

  // 🚀 Register function
  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
  
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      console.log("Register response:", res.status, data); // Debugging
  
      if (res.ok) {
        setUser(data.user); // ✅ Store user info
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };
  

  // 🚀 Logout function
  const logout = () => {
    localStorage.removeItem('token'); // ✅ Remove token
    setUser(null);
  };
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
