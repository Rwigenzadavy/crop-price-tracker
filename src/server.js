const app = require('./app');
const initializeDatabase = require('./initDatabase');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`CropTrack running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start CropTrack:', error.message);
    process.exit(1);
  }
}

startServer();
