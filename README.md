# CropTrack

> Know the price before you go to market.

## Problem Statement

Smallholder farmers in Rwanda often don't know the current market prices for their crops. They sell at whatever price a buyer offers and can lose income because they can't compare markets. CropTrack lets them check and compare crop prices across markets before they decide where to sell.

## Target Users

- Smallholder farmers deciding where to sell
- Small traders comparing buying prices
- Cooperative managers tracking market prices

## Core Features

1. View prices for 5 crops (Maize, Beans, Rice, Potatoes, Cassava)
2. Search by crop name
3. Filter by market (Kigali, Musanze, Huye)
4. See the cheapest market for a crop
5. Simple web dashboard

> Prices are sample data

## Technology Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript
- **Data:** JSON file (`data/prices.json`)
- **Testing:** Jest, Supertest

## Project Structure

```
crop-price-tracker/
├── data/prices.json          # Sample price data
├── public/                   # Frontend (HTML, CSS, JS)
├── src/
│   ├── server.js             # Starts the server
│   ├── app.js                # Express setup
│   ├── routes/prices.js      # API endpoints
│   └── services/priceService.js  # Search, filter, cheapest logic
├── tests/                    # Unit and API tests
├── .env.example              # Example environment variables
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- Git

### Run the app locally

```bash
git clone https://github.com/Rwigenzadavy/crop-price-tracker.git
cd crop-price-tracker
npm install
npm start
```

Open http://localhost:3000 in your browser.

Optionally, copy `.env.example` to `.env` to change the port.

### Run the tests

```bash
npm test
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Server health check |
| `GET /api/prices` | All prices |
| `GET /api/prices?crop=maize` | Search by crop |
| `GET /api/prices?market=Kigali` | Filter by market |
| `GET /api/prices/markets` | List of markets |
| `GET /api/prices/cheapest/:crop` | Cheapest market for a crop |

## Team Workflow

- `main` is protected: all changes go through a pull request with 1 approval.
- Review comments must be resolved and branches up to date before merging.
- Work is planned on our GitHub Projects board with issues, labels and a milestone.
- Secrets live in `.env`, which is git-ignored.

## Roadmap

- Admin login and roles (admin adds prices by province)
- Move storage from JSON to SQLite
- CI with GitHub Actions
- Docker containerization
- Cloud deployment

## Team

| Name | GitHub | Role |
|---|---|---|
| Rwigenza Davy | @Rwigenzadavy | Team lead and repo setup |
| Jurie Isaro | @Isa-julie | Tests and Documentation
| Kethia Karangwa | @kkarangwa | Frontend |
| Ivan Mucyo | @keen-ivan | backend and Services  |

## License

MIT. See [LICENSE](LICENSE).