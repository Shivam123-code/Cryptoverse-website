import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoin } from '../services/api.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Globe, Github, Twitter } from 'lucide-react';
import WatchlistButton from '../components/WatchlistButton.jsx';

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        if (id) {
          const data = await getCoin(id);
          setCoin(data);
        }
      } catch (error) {
        console.error('Error fetching coin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-400">Coin not found</p>
      </div>
    );
  }

  const priceChange = coin.market_data?.price_change_percentage_24h;
  const priceData = coin.market_data?.sparkline_7d?.price?.map((price, index) => ({
    price,
    index,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center space-x-4 mb-6">
              <img src={coin.image?.large} alt={coin.name} className="w-16 h-16" />
              <div>
                <h1 className="text-3xl font-bold">{coin.name}</h1>
                <p className="text-gray-400 uppercase">{coin.symbol}</p>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                {priceChange && (
                  <div className="flex items-center space-x-2">
                    {priceChange > 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                    <span className={priceChange > 0 ? 'text-green-500' : 'text-red-500'}>
                      {priceChange.toFixed(2)}%
                    </span>
                  </div>
                )}
                {id && <WatchlistButton itemId={id} itemType="coin" onAuthRequired={() => setIsAuthModalOpen(true)} />}
              </div>
            </div>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <XAxis dataKey="index" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={priceChange > 0 ? '#10B981' : '#EF4444'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Market Cap Rank</p>
                <p className="text-lg font-semibold">#{coin.market_cap_rank}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-lg font-semibold">
                  ${coin.market_data?.market_cap?.usd?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Volume (24h)</p>
                <p className="text-lg font-semibold">
                  ${coin.market_data?.total_volume?.usd?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Circulating Supply</p>
                <p className="text-lg font-semibold">
                  {coin.market_data?.circulating_supply?.toLocaleString()} {coin.symbol.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <a
                  href={coin.links?.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Website
                </a>
              </div>
              {coin.links?.repos_url?.github?.[0] && (
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5 text-gray-400" />
                  <a
                    href={coin.links.repos_url.github[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    GitHub
                  </a>
                </div>
              )}
              {coin.links?.twitter_screen_name && (
                <div className="flex items-center space-x-2">
                  <Twitter className="w-5 h-5 text-gray-400" />
                  <a
                    href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Twitter
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mt-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div
              className="text-gray-400 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: coin.description?.en || 'No description available.' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;