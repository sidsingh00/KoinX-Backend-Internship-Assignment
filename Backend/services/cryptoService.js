const axios = require('axios');
const CryptoPrice = require('../models/CryptoPrice');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

async function fetchCryptoPrices() {
  try {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: coins.join(','),
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true
      },
      headers: {
        Authorization: `Bearer YOUR_API_KEY`
      }
    });

    const updates = [];
    for (const [coinId, data] of Object.entries(response.data)) {
      updates.push(new CryptoPrice({
        coinId,
        price: data.usd,
        marketCap: data.usd_market_cap,
        priceChange24h: data.usd_24h_change
      }).save());
    }

    await Promise.all(updates);
    console.log('Crypto prices updated successfully');
  } catch (error) {
    console.error('Error fetching crypto prices:', error.message);
  }
}

async function getLatestStats(coinId) {
  const latestPrice = await CryptoPrice.findOne({ coinId })
    .sort({ timestamp: -1 })
    .lean();

  if (!latestPrice) {
    throw new Error('No data found for this cryptocurrency');
  }

  return {
    price: latestPrice.price,
    marketCap: latestPrice.marketCap,
    "24hChange": latestPrice.priceChange24h
  };
}

async function calculateDeviation(coinId) {
  const prices = await CryptoPrice.find({ coinId })
    .sort({ timestamp: -1 })
    .limit(100)
    .select('price')
    .lean();

  if (prices.length === 0) {
    throw new Error('No data found for this cryptocurrency');
  }

  const priceValues = prices.map(p => p.price);
  const mean = priceValues.reduce((a, b) => a + b) / priceValues.length;
  const squaredDiffs = priceValues.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / priceValues.length;
  const deviation = Math.sqrt(variance);

  return { deviation: Number(deviation.toFixed(2)) };
}

module.exports = {
  fetchCryptoPrices,
  getLatestStats,
  calculateDeviation
};