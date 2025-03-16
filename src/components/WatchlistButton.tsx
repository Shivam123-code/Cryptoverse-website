import React, { useState, useEffect } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WatchlistButtonProps {
  itemId: string;
  itemType: 'coin' | 'exchange';
  onAuthRequired: () => void;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ itemId, itemType, onAuthRequired }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkWatchlistStatus = async () => {
      try {
        setError(null);
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          if (mounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', session.session.user.id)
          .eq('item_id', itemId)
          .eq('item_type', itemType)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (mounted) {
          setIsInWatchlist(!!data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking watchlist status:', err);
        if (mounted) {
          setError('Failed to check watchlist status');
          setLoading(false);
        }
      } finally {
        if (mounted) {
          setRetrying(false);
        }
      }
    };

    checkWatchlistStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        checkWatchlistStatus();
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [itemId, itemType]);

  const toggleWatchlist = async () => {
    try {
      setError(null);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        onAuthRequired();
        return;
      }

      setLoading(true);
      if (isInWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('item_id', itemId)
          .eq('item_type', itemType);

        if (error) throw error;
        setIsInWatchlist(false);
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert({
            item_id: itemId,
            item_type: itemType,
            user_id: session.session.user.id,
          })
          .single();

        if (error) {
          if (error.code === '23505') {
            setIsInWatchlist(true);
            return;
          }
          throw error;
        }
        setIsInWatchlist(true);
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      setError('Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    setError(null);
    setLoading(true);
    const { data: session } = supabase.auth.getSession();
    if (!session) {
      onAuthRequired();
      return;
    }
  };

  if (error) {
    return (
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
      >
        <AlertCircle className="w-5 h-5" />
        <span>{retrying ? 'Retrying...' : 'Retry'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isInWatchlist
          ? 'bg-yellow-500/20 text-yellow-500'
          : 'bg-gray-800 text-gray-400 hover:text-yellow-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      <Star className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
      <span>{isInWatchlist ? 'Watchlisted' : 'Add to Watchlist'}</span>
    </button>
  );
};

export default WatchlistButton