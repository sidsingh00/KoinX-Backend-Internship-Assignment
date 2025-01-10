# Crypto Price Tracker

A Node.js application that tracks cryptocurrency prices using the CoinGecko API and stores historical data in Supabase.

## Features

- Real-time cryptocurrency price tracking
- Historical price data storage
- Price statistics and deviation calculations
- Supported cryptocurrencies: Bitcoin, Ethereum, and Polygon (MATIC)
- Automated price updates every 2 hours

## Prerequisites

- Node.js v14 or higher
- Supabase account
- CoinGecko API access (free tier)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
├── src/
│   ├── config.js          # Configuration and environment setup
│   ├── index.js           # Main application entry point
│   ├── jobs/              # Scheduled jobs
│   │   └── updatePrices.js
│   ├── routes/            # API routes
│   │   └── cryptoRoutes.js
│   └── services/          # Business logic
│       └── cryptoService.js
├── supabase/             # Database migrations
│   └── migrations/
├── package.json
└── README.md
```

## API Endpoints

### Get Cryptocurrency Statistics
```
GET /stats?coin=bitcoin
```
Query Parameters:
- `coin`: Supported values are 'bitcoin', 'ethereum', 'matic-network'

Response:
```json
{
  "price": 42000.50,
  "marketCap": 800000000000,
  "24hChange": 2.5
}
```

### Get Price Deviation
```
GET /deviation?coin=bitcoin
```
Query Parameters:
- `coin`: Supported values are 'bitcoin', 'ethereum', 'matic-network'

Response:
```json
{
  "deviation": 1250.75
}
```

## Running the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Dependencies

- `express`: Web server framework
- `@supabase/supabase-js`: Supabase client
- `axios`: HTTP client for API requests
- `dotenv`: Environment variables management
- `node-cron`: Task scheduler

## Database Schema

The application uses a single table `crypto_prices` with the following structure:
- `id`: UUID (Primary Key)
- `coin_id`: Text (Cryptocurrency identifier)
- `price_usd`: Numeric (Current price in USD)
- `market_cap_usd`: Numeric (Market capitalization in USD)
- `price_change_24h`: Numeric (24-hour price change percentage)
- `created_at`: Timestamp with timezone (Record creation time)

## Testing with Postman

1. Start the server locally
2. Import these example requests:

GET Statistics:
```
GET http://localhost:3000/stats?coin=bitcoin
```

GET Deviation:
```
GET http://localhost:3000/deviation?coin=bitcoin
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Successful request
- 400: Invalid parameters
- 500: Server error