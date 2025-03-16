import React, { useEffect, useState } from 'react';
import { getExchanges } from '../services/api';
import { Exchange } from '../types';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Exchanges: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const data = await getExchanges();
        setExchanges(data);
      } catch (err) {
        // Handle error properly without trying to log the entire error object
        setError('Failed to fetch exchanges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cryptocurrency Exchanges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exchanges.map((exchange) => (
          <Link
            key={exchange.id}
            to={`/exchanges/${exchange.id}`}
            className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800"
          >
            <div className="flex items-center space-x-4">
              <img
                src={exchange.image}
                alt={exchange.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{exchange.name}</h3>
                <p className="text-gray-400">{exchange.country}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Trust Score</p>
                <p className="text-lg font-semibold">{exchange.trust_score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">24h Volume (BTC)</p>
                <p className="text-lg font-semibold">
                  {exchange.trade_volume_24h_btc.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Exchanges;