const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
const pricesRouter = require('./routes/prices');
app.use('/api/prices', pricesRouter);
module.exports = app;