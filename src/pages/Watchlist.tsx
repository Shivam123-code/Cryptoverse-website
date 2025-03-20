import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { getCoins, getExchanges } from '../services/api';
import { Trash2, ExternalLink, AlertCircle } from 'lucide-react';

const Watchlist: React.FC = () => {
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      fetchWatchlist();
    };

    checkAuth();
  }, [navigate]);

  const fetchWatchlist = async () => {
    try {
      setError(null);
      const { data: watchlist, error: watchlistError } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (watchlistError) throw watchlistError;

      if (!watchlist?.length) {
        setWatchlistItems([]);
        setLoading(false);
        return;
      }

      const coinIds = watchlist.filter(item => item.item_type === 'coin').map(item => item.item_id);
      const exchangeIds = watchlist.filter(item => item.item_type === 'exchange').map(item => item.item_id);

      const [coinsData, exchangesData] = await Promise.all([
        coinIds.length > 0 ? getCoins() : [],
        exchangeIds.length > 0 ? getExchanges() : []
      ]);

      const enrichedWatchlist = watchlist.map(item => {
        if (item.item_type === 'coin') {
          const coinData = coinsData.find((coin: any) => coin.id === item.item_id);
          return { ...item, details: coinData || null };
        } else {
          const exchangeData = exchangesData.find((exchange: any) => exchange.id === item.item_id);
          return { ...item, details: exchangeData || null };
        }
      }).filter(item => item.details !== null);

      setWatchlistItems(enrichedWatchlist);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Failed to load watchlist items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setWatchlistItems(items => items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove item from watchlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Watchlist</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {watchlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Your watchlist is empty</p>
          <div className="space-x-4">
            <Link
              to="/coins"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Coins
            </Link>
            <Link
              to="/exchanges"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Exchanges
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <Link
                  to={`/${item.item_type}s/${item.item_id}`}
                  className="flex items-center space-x-3 flex-1"
                >
                  {item.details?.image && (
                    <img
                      src={item.details.image}
                      alt={item.details.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{item.details?.name}</h3>
                    <p className="text-gray-400">
                      {item.item_type === 'coin'
                        ? item.details?.symbol?.toUpperCase()
                        : item.details?.country || 'Global'}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {item.item_type === 'coin' && item.details && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="font-semibold">
                      ${item.details.current_price?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">24h Change</p>
                    <p
                      className={`font-semibold ${
                        item.details.price_change_percentage_24h > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {item.details.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}

              {item.item_type === 'exchange' && item.details && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Trust Score</p>
                      <p className="font-semibold">{item.details.trust_score}/10</p>
                    </div>
                    <Link
                      to={`/exchanges/${item.item_id}`}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;