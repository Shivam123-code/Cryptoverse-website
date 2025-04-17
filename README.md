# 🪙 Cryptoverse

A full-stack cryptocurrency tracking platform built with React, Node.js, Express, and PostgreSQL. Users can browse crypto data, manage watchlists, take price snapshots, and explore a powerful admin dashboard for analytics and management.

## 🚀 Features

### 👤 User Features
- 🔐 JWT Authentication (Login/Register)
- 📈 Browse cryptocurrency market data from CoinGecko API
- 📌 Add/remove coins from personal watchlist
- 📷 Take snapshots of current coin prices
- 🗂 View historical price snapshots per coin

### 🔧 Admin Features
- 📊 View platform statistics (Total Users, Posts, Watchlist Items)
- 🧑 Manage users (view/delete)
- 📝 Manage posts and watchlist entries
- 📍 Clickable dashboard cards to drill into data

---

## 🛠 Tech Stack

### 🔹 Frontend
- React (Vite)
- Axios
- React Router
- Tailwind CSS / Custom CSS

### 🔹 Backend
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- `connect-pg-simple` for session storage
- CoinGecko API for live crypto data

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cryptoverse.git
cd cryptoverse
