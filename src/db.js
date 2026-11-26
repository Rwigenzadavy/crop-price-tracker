const { Pool } = require('pg');

const requiredVariables = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingVariables.join(', ')}`
  );
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

module.exports = pool;
