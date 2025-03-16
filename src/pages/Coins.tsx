import React, { useEffect, useState } from 'react';
import { getCoins } from '../services/api';
import { Coin } from '../types';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const Coins: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins(page);
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cryptocurrency Market</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coins.map((coin) => (
          <Link
            key={coin.id}
            to={`/coins/${coin.id}`}
            className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800"
          >
            <div className="flex items-center space-x-4">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{coin.name}</h3>
                <p className="text-gray-400 uppercase">{coin.symbol}</p>
              </div>
              {coin.price_change_percentage_24h > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="mt-4">
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coin.sparkline_in_7d.price.map((price, index) => ({ price, index }))}>
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={coin.price_change_percentage_24h > 0 ? '#10B981' : '#EF4444'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-lg font-semibold">
                    ${coin.current_price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">24h Change</p>
                  <p
                    className={`text-lg font-semibold ${
                      coin.price_change_percentage_24h > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-800 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Coins;