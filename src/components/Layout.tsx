import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Search, Coins, BarChart3, Home, LogOut, User, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

const Layout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Coins className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">CryptoVerse</span>
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link to="/" className="flex items-center space-x-1 hover:text-blue-500">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link to="/exchanges" className="flex items-center space-x-1 hover:text-blue-500">
                  <BarChart3 className="w-4 h-4" />
                  <span>Exchanges</span>
                </Link>
                <Link to="/coins" className="flex items-center space-x-1 hover:text-blue-500">
                  <Coins className="w-4 h-4" />
                  <span>Coins</span>
                </Link>
                {user && (
                  <>
                    <Link to="/watchlist" className="flex items-center space-x-1 hover:text-blue-500">
                      <User className="w-4 h-4" />
                      <span>Watchlist</span>
                    </Link>
                    <Link to="/posts" className="flex items-center space-x-1 hover:text-blue-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>Posts</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coins..."
                  className="bg-gray-800 text-gray-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>© 2024 CryptoVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Layout;