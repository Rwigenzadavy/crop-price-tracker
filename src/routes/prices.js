const express = require('express');
const priceService = require('../services/priceService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { crop, market } = req.query;
    const result = await priceService.getPrices({ crop, market });
    res.json(result);
  } catch (error) {
    console.error('Failed to retrieve crop prices:', error.message);
    res.status(500).json({ error: 'Unable to retrieve crop prices' });
  }
});

router.get('/markets', async (req, res) => {
  try {
    const result = await priceService.getMarkets();
    res.json(result);
  } catch (error) {
    console.error('Failed to retrieve markets:', error.message);
    res.status(500).json({ error: 'Unable to retrieve markets' });
  }
});

router.get('/cheapest/:crop', async (req, res) => {
  try {
    const result = await priceService.getCheapestMarket(req.params.crop);

    if (!result) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Failed to retrieve cheapest market:', error.message);
    res.status(500).json({ error: 'Unable to retrieve cheapest market' });
  }
});

module.exports = router;
