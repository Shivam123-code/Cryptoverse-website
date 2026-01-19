import axios from 'axios';

const COINGECKO_API_KEY = 'CG-kx6GRWADZUa15FPCbAQQ86bj';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  params: {
    x_cg_demo_api_key: COINGECKO_API_KEY
  }
});

// Enhanced error handling for CoinGecko API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      return Promise.reject(new Error('Rate limit exceeded. Please try again in a minute.'));
    }
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found.'));
    }
    if (error.response?.status === 500) {
      return Promise.reject(new Error('CoinGecko API is experiencing issues. Please try again later.'));
    }
    return Promise.reject(new Error('Failed to fetch data. Please try again.'));
  }
);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithDelay = async (fn, retries = 3, delayMs = 1000, backoff = 2) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;

    const waitTime = error.message.includes('rate limit') ? delayMs * 2 : delayMs;

    await delay(waitTime);
    return retryWithDelay(fn, retries - 1, waitTime * backoff, backoff);
  }
};

export const getExchanges = async () => {
  return retryWithDelay(async () => {
    const { data } = await api.get('/exchanges');
    return data;
  });
};

export const getCoins = async (page = 1) => {
  return retryWithDelay(async () => {
    const { data } = await api.get(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=true`
    );
    return data;
  });
};

export const getCoin = async (id) => {
  return retryWithDelay(async () => {
    const { data } = await api.get(
      `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
    );
    return data;
  });
};

export const getExchangeDetail = async (exchangeId) => {
  return retryWithDelay(async () => {
    try {
      const [exchangeData, tickersData] = await Promise.all([
        api.get(`/exchanges/${exchangeId}`).then(res => res.data),
        api.get(`/exchanges/${exchangeId}/tickers`).then(res => res.data)
      ]);
      return { ...exchangeData, tickers: tickersData.tickers };
    } catch (error) {
      throw new Error(`Failed to fetch exchange details: ${error.message}`);
    }
  });
};

export const searchAll = async (query) => {
  return retryWithDelay(async () => {
    try {
      const [searchData, allExchanges] = await Promise.all([
        api.get(`/search?query=${encodeURIComponent(query)}`).then(res => res.data),
        api.get('/exchanges').then(res => res.data)
      ]);

      const filteredExchanges = allExchanges.filter((exchange) =>
        exchange.name.toLowerCase().includes(query.toLowerCase()) ||
        exchange.id.toLowerCase().includes(query.toLowerCase())
      );

      const formattedExchanges = filteredExchanges.map((exchange) => ({
        id: exchange.id,
        name: exchange.name,
        large: exchange.image,
        country: exchange.country,
        trust_score: exchange.trust_score,
        trade_volume_24h_btc: exchange.trade_volume_24h_btc
      }));

      return {
        coins: searchData.coins || [],
        exchanges: formattedExchanges || []
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  });
};
