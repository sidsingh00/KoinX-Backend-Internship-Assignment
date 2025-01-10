const express = require('express');
const router = express.Router();
const cryptoService = require('../services/cryptoService');


router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const stats = await cryptoService.getLatestStats(coin);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const deviation = await cryptoService.calculateDeviation(coin);
    res.json(deviation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;