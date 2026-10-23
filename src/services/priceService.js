const prices = require('../../data/prices.json');


// Search by crop name (partial, case-insensitive) and/or filter by market (exact, case-insensitive)
function getPrices({ crop, market } = {}) {
  return prices.filter((item) => {
    const cropMatch = !crop || item.crop.toLowerCase().includes(crop.toLowerCase());
    const marketMatch = !market || item.market.toLowerCase() === market.toLowerCase();
    return cropMatch && marketMatch;
  });
}


// List of unique markets, for the dropdown
function getMarkets() {
  return [...new Set(prices.map((item) => item.market))];
}


// The entry with the lowest price for a crop, or null if the crop isn't found
function getCheapestMarket(crop) {
  const matches = getPrices({ crop });
  if (matches.length === 0) return null;
  return matches.reduce((lowest, item) => (item.price < lowest.price ? item : lowest));
}


module.exports = { getPrices, getMarkets, getCheapestMarket };