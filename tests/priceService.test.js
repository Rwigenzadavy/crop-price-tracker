jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const pool = require('../src/db');
const priceService = require('../src/services/priceService');

const samplePrices = [
  { crop: 'Maize', market: 'Kigali', price: '450', unit: 'kg' },
  { crop: 'Maize', market: 'Musanze', price: '400', unit: 'kg' },
  { crop: 'Maize', market: 'Huye', price: '420', unit: 'kg' },
  { crop: 'Beans', market: 'Kigali', price: '900', unit: 'kg' },
  { crop: 'Beans', market: 'Musanze', price: '850', unit: 'kg' },
  { crop: 'Beans', market: 'Huye', price: '870', unit: 'kg' },
  { crop: 'Rice', market: 'Kigali', price: '1100', unit: 'kg' },
  { crop: 'Rice', market: 'Musanze', price: '1150', unit: 'kg' },
  { crop: 'Rice', market: 'Huye', price: '1050', unit: 'kg' },
  { crop: 'Potatoes', market: 'Kigali', price: '350', unit: 'kg' },
  { crop: 'Potatoes', market: 'Musanze', price: '280', unit: 'kg' },
  { crop: 'Potatoes', market: 'Huye', price: '320', unit: 'kg' },
  { crop: 'Cassava', market: 'Kigali', price: '300', unit: 'kg' },
  { crop: 'Cassava', market: 'Musanze', price: '330', unit: 'kg' },
  { crop: 'Cassava', market: 'Huye', price: '270', unit: 'kg' },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getPrices', () => {
  test('returns all 15 entries when no filters are given', async () => {
    pool.query.mockResolvedValue({ rows: samplePrices });

    const result = await priceService.getPrices();

    expect(result).toHaveLength(15);
    expect(result[0].price).toBe(450);
  });

  test('searches by crop name', async () => {
    pool.query.mockResolvedValue({
      rows: samplePrices.filter((item) => item.crop === 'Maize'),
    });

    const result = await priceService.getPrices({ crop: 'maize' });

    expect(result).toHaveLength(3);
    expect(pool.query.mock.calls[0][1]).toEqual(['%maize%']);
  });

  test('filters by market', async () => {
    pool.query.mockResolvedValue({
      rows: samplePrices.filter((item) => item.market === 'Kigali'),
    });

    const result = await priceService.getPrices({ market: 'Kigali' });

    expect(result).toHaveLength(5);
    expect(pool.query.mock.calls[0][1]).toEqual(['Kigali']);
  });

  test('combines crop and market filters', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { crop: 'Rice', market: 'Musanze', price: '1150', unit: 'kg' },
      ],
    });

    const result = await priceService.getPrices({
      crop: 'rice',
      market: 'Musanze',
    });

    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(1150);
    expect(pool.query.mock.calls[0][1]).toEqual([
      '%rice%',
      'Musanze',
    ]);
  });

  test('returns an empty list for an unknown crop', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await priceService.getPrices({ crop: 'xyz' });

    expect(result).toEqual([]);
  });
});

describe('getMarkets', () => {
  test('returns the unique list of markets', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { market: 'Kigali' },
        { market: 'Musanze' },
        { market: 'Huye' },
      ],
    });

    const result = await priceService.getMarkets();

    expect(result).toEqual(['Kigali', 'Musanze', 'Huye']);
  });
});

describe('getCheapestMarket', () => {
  test('returns the lowest-priced market for a crop', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { crop: 'Potatoes', market: 'Musanze', price: '280', unit: 'kg' },
      ],
    });

    const result = await priceService.getCheapestMarket('potatoes');

    expect(result.market).toBe('Musanze');
    expect(result.price).toBe(280);
  });

  test('returns null for an unknown crop', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await priceService.getCheapestMarket('xyz');

    expect(result).toBeNull();
  });
});
