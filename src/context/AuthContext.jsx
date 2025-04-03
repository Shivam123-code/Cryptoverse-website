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

  // ✅ Load user from local storage on startup
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔹 Login response:", res.status, data);

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) setUser(data.user);
      else setError(data.error);
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout: () => setUser(null), isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};
