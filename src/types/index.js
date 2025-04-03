// No need for export default Index as it doesn't exist

// Exchange Model (for reference)
const Exchange = {
  id: '',
  name: '',
  year_established: 0,
  country: '',
  image: '',
  trust_score: 0,
  trade_volume_24h_btc: 0
};

// Coin Model (for reference)
const Coin = {
  id: '',
  symbol: '',
  name: '',
  image: '',
  current_price: 0,
  market_cap: 0,
  market_cap_rank: 0,
  price_change_percentage_24h: 0,
  sparkline_in_7d: {
    price: []
  }
};

export { Exchange, Coin };
