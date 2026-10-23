const priceService = require('../src/services/priceService');


describe('getPrices', () => {
  test('returns all 15 entries when no filters are given', () => {
    expect(priceService.getPrices()).toHaveLength(15);
  });


  test('searches by crop name', () => {
    const result = priceService.getPrices({ crop: 'maize' });
    expect(result).toHaveLength(3);
    result.forEach((item) => expect(item.crop).toBe('Maize'));
  });


  test('search is case-insensitive', () => {
    expect(priceService.getPrices({ crop: 'MAIZE' })).toHaveLength(3);
  });


  test('search matches partial names', () => {
    expect(priceService.getPrices({ crop: 'mai' })).toHaveLength(3);
  });


  test('filters by market', () => {
    const result = priceService.getPrices({ market: 'Kigali' });
    expect(result).toHaveLength(5);
    result.forEach((item) => expect(item.market).toBe('Kigali'));
  });


  test('market filter is case-insensitive', () => {
    expect(priceService.getPrices({ market: 'kigali' })).toHaveLength(5);
  });


  test('combines crop and market filters', () => {
    const result = priceService.getPrices({ crop: 'rice', market: 'Musanze' });
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(1150);
  });


  test('returns an empty list for an unknown crop', () => {
    expect(priceService.getPrices({ crop: 'xyz' })).toEqual([]);
  });


  test('returns an empty list for an unknown market', () => {
    expect(priceService.getPrices({ market: 'Nowhere' })).toEqual([]);
  });
});


describe('getMarkets', () => {
  test('returns the unique list of markets', () => {
    expect(priceService.getMarkets()).toEqual(['Kigali', 'Musanze', 'Huye']);
  });
});


describe('getCheapestMarket', () => {
  test('returns the lowest-priced market for a crop', () => {
    const result = priceService.getCheapestMarket('potatoes');
    expect(result.market).toBe('Musanze');
    expect(result.price).toBe(280);
  });


  test('works with different letter case', () => {
    expect(priceService.getCheapestMarket('CASSAVA').market).toBe('Huye');
  });


  test('returns null for an unknown crop', () => {
    expect(priceService.getCheapestMarket('xyz')).toBeNull();
  });
});