import React from 'react';
import { ArrowRight, TrendingUp, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative pt-16 pb-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Explore the Crypto Universe
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-xl text-gray-300 sm:text-2xl md:mt-5 md:max-w-3xl">
                Your gateway to the world of cryptocurrency. Track prices, explore exchanges, and stay informed.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  to="/coins"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Explore Coins
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/exchanges"
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white"
                >
                  View Exchanges
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-gray-400">Monitor cryptocurrency prices and market movements in real-time.</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Exchanges</h3>
              <p className="text-gray-400">Access information from leading cryptocurrency exchanges worldwide.</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-gray-400">Trust in our secure platform for accurate cryptocurrency data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;