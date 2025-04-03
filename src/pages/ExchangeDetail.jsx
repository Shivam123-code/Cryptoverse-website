import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExchangeDetail } from '../services/api';
import { ExternalLink, Globe, Twitter, Facebook, AlertCircle, RefreshCw } from 'lucide-react';
import WatchlistButton from '../components/WatchlistButton';

const ExchangeDetail = () => {
  const { id } = useParams();
  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchExchange = async () => {
    try {
      setLoading(true);
      setError(null);
      if (id) {
        const data = await getExchangeDetail(id);
        setExchange(data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch exchange details. Please try again later.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchExchange();
  }, [id]);

  const handleRetry = () => {
    setRetrying(true);
    fetchExchange();
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

  if (error || !exchange) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center space-x-2 text-red-500 mb-4">
            <AlertCircle className="w-5 h-5" />
            <p>{error || 'Exchange not found'}</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-8">
          <img src={exchange.image} alt={exchange.name} className="w-20 h-20 rounded-lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{exchange.name}</h1>
            <p className="text-gray-400">{exchange.country || 'Global'}</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Trust Score Rank</p>
              <p className="text-2xl font-bold text-blue-500">#{exchange.trust_score_rank}</p>
            </div>
            {id && <WatchlistButton itemId={id} itemType="exchange" onAuthRequired={() => setIsAuthModalOpen(true)} />}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Trust Score</p>
            <p className="text-2xl font-bold">{exchange.trust_score}/10</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">24h Volume (BTC)</p>
            <p className="text-2xl font-bold">{exchange.trade_volume_24h_btc?.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Year Established</p>
            <p className="text-2xl font-bold">{exchange.year_established || 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Active Pairs</p>
            <p className="text-2xl font-bold">{exchange.tickers?.length || 0}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Social Links</h2>
            <div className="space-y-4">
              {exchange.url && (
                <a
                  href={exchange.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-400"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {exchange.twitter_handle && (
                <a
                  href={`https://twitter.com/${exchange.twitter_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-400"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {exchange.facebook_url && (
                <a
                  href={exchange.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-400"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Exchange Info</h2>
            <div className="space-y-2">
              <p><span className="text-gray-400">Centralized:</span> {exchange.centralized ? 'Yes' : 'No'}</p>
              <p><span className="text-gray-400">Country:</span> {exchange.country || 'Global'}</p>
              {exchange.description && (
                <p className="text-sm text-gray-400 mt-4">{exchange.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Trading Pairs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Trading Pairs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4 px-4">Pair</th>
                  <th className="pb-4 px-4">Price</th>
                  <th className="pb-4 px-4">Volume (24h)</th>
                  <th className="pb-4 px-4">Trust Score</th>
                </tr>
              </thead>
              <tbody>
                {exchange.tickers?.slice(0, 50).map((ticker, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{ticker.base}/{ticker.target}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">${ticker.last?.toFixed(2) || 'N/A'}</td>
                    <td className="py-4 px-4">${ticker.volume?.toFixed(2) || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded ${
                        ticker.trust_score === 'green' ? 'bg-green-500/20 text-green-500' :
                        ticker.trust_score === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {ticker.trust_score || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDetail;