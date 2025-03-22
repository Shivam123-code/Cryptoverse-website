import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll } from '../services/api';
import { TrendingUp, TrendingDown, ExternalLink, AlertCircle, RefreshCw, Star } from 'lucide-react';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<{ coins: any[]; exchanges: any[] }>({
    coins: [],
    exchanges: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchAll(query);
      setResults(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const handleRetry = () => {
    setRetrying(true);
    fetchResults();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          {retrying && <p className="text-gray-400">Retrying...</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center space-x-2 text-red-500 mb-4">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'Retrying...' : 'Retry'}</span>
          </button>
        </div>
      </div>
    );
  }

  const hasResults = results.coins.length > 0 || results.exchanges.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      
      {!hasResults ? (
        <p className="text-gray-400">No results found.</p>
      ) : (
        <div className="space-y-8">
          {/* Exchanges Section - Moved to top since it's the focus */}
          {results.exchanges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.exchanges.map((exchange) => (
                  <Link
                    key={exchange.id}
                    to={`/exchanges/${exchange.id}`}
                    className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800"
                  >
                    <div className="flex items-center space-x-4">
                      <img src={exchange.large} alt={exchange.name} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{exchange.name}</h3>
                        <p className="text-gray-400">{exchange.country || 'Global'}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{exchange.trust_score || 'N/A'}</span>
                        </div>
                        <p className="text-sm text-gray-400">Trust Score</p>
                      </div>
                    </div>
                    {exchange.trade_volume_24h_btc && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-sm text-gray-400">24h Volume (BTC)</p>
                        <p className="font-semibold">{exchange.trade_volume_24h_btc.toFixed(2)}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Coins Section */}
          {results.coins.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Cryptocurrencies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.coins.map((coin) => (
                  <Link
                    key={coin.id}
                    to={`/coins/${coin.id}`}
                    className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800"
                  >
                    <div className="flex items-center space-x-4">
                      <img src={coin.large} alt={coin.name} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{coin.name}</h3>
                        <p className="text-gray-400 uppercase">{coin.symbol}</p>
                      </div>
                      {coin.market_cap_rank && (
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Rank</p>
                          <p className="font-semibold">#{coin.market_cap_rank}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;