import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Exchanges from './pages/Exchanges';
import ExchangeDetail from './pages/ExchangeDetail';
import Coins from './pages/Coins';
import CoinDetail from './pages/CoinDetail';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Posts from './pages/Posts';
import Snapshots from './pages/Snapshots';
import SnapshotList from './pages/SnapshotList';
import { AuthProvider } from './context/AuthContext';
import Admin from './pages/Admin';
import  AdminPosts  from './pages/AdminPosts';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="exchanges" element={<Exchanges />} />
            <Route path="exchanges/:id" element={<ExchangeDetail />} />
            <Route path="coins" element={<Coins />} />
            <Route path="coins/:id" element={<CoinDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="/snapshots" element={<SnapshotList />} />
            <Route path="/snapshots/:itemId" element={<Snapshots />} />
            <Route path="posts" element={<Posts />} />
            <Route path="admin" element={<Admin/>}/>
            <Route path="/admin/posts" element={<AdminPosts />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
