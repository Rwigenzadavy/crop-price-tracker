const pool = require('../db');

function formatPrice(row) {
  return {
    ...row,
    price: Number(row.price),
  };
}

async function getPrices({ crop, market } = {}) {
  const conditions = [];
  const values = [];

  if (crop) {
    values.push(`%${crop}%`);
    conditions.push(`crop ILIKE $${values.length}`);
  }

  if (market) {
    values.push(market);
    conditions.push(`market ILIKE $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const result = await pool.query(
    `SELECT crop, market, price, unit
     FROM crop_prices
     ${whereClause}
     ORDER BY id`,
    values
  );

  return result.rows.map(formatPrice);
}

async function getMarkets() {
  const result = await pool.query(
    `SELECT market
     FROM crop_prices
     GROUP BY market
     ORDER BY MIN(id)`
  );

  return result.rows.map((row) => row.market);
}

async function getCheapestMarket(crop) {
  const result = await pool.query(
    `SELECT crop, market, price, unit
     FROM crop_prices
     WHERE crop ILIKE $1
     ORDER BY price ASC
     LIMIT 1`,
    [`%${crop}%`]
  );

  return result.rows.length ? formatPrice(result.rows[0]) : null;
}

module.exports = {
  getPrices,
  getMarkets,
  getCheapestMarket,
};
