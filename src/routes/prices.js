const express = require('express');
const priceService = require('../services/priceService');


const router = express.Router();


// GET /api/prices  or  /api/prices?crop=maize&market=Kigali
router.get('/', (req, res) => {
  const { crop, market } = req.query;
  res.json(priceService.getPrices({ crop, market }));
});


// GET /api/prices/markets
router.get('/markets', (req, res) => {
  res.json(priceService.getMarkets());
});


// GET /api/prices/cheapest/maize
router.get('/cheapest/:crop', (req, res) => {
  const result = priceService.getCheapestMarket(req.params.crop);
  if (!result) {
    return res.status(404).json({ error: 'Crop not found' });
  }
  res.json(result);
});


module.exports = router;