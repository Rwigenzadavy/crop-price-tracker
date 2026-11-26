const pool = require('./db');
const prices = require('../data/prices.json');

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS crop_prices (
      id SERIAL PRIMARY KEY,
      crop VARCHAR(100) NOT NULL,
      market VARCHAR(100) NOT NULL,
      price NUMERIC(12, 2) NOT NULL,
      unit VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (crop, market, unit)
    )
  `);

  for (const item of prices) {
    await pool.query(
      `INSERT INTO crop_prices (crop, market, price, unit)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [item.crop, item.market, item.price, item.unit]
    );
  }

  const result = await pool.query(
    'SELECT COUNT(*) FROM crop_prices'
  );

  console.log(
    `Database initialized. Crop-price records: ${result.rows[0].count}`
  );
}

module.exports = initializeDatabase;
