const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error.message);

    res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

const pricesRouter = require('./routes/prices');
app.use('/api/prices', pricesRouter);

module.exports = app;
