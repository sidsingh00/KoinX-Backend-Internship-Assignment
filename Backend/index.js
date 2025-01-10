const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const dotenv = require('dotenv');
const cryptoRoutes = require('./routes/cryptoRoutes');
const cryptoService = require('./services/cryptoService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());


app.use('/', cryptoRoutes);


cron.schedule('0 */2 * * *', () => {
  console.log('Running scheduled crypto price update');
  cryptoService.fetchCryptoPrices();
});


cryptoService.fetchCryptoPrices();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});