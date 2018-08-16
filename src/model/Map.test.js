const Map = require('./Map');

describe('Map', () => {
  describe('constructor', () => {
    test('Should set data, cols & rows', () => {
      const data = [];
      const rows = 100;
      const cols = 89;

      const map = new Map(data, rows, cols);

      expect(map.data).toBe(data);
      expect(map.cols).toBe(cols);
      expect(map.rows).toBe(rows);
    });
  });

  describe('.getElevation', () => {
    test('Should return the elevation at the coordinate', () => {
      const map = new Map(
        [
          5, 8, 69, 9, 85,
          1, 0, 156, 695,
        ],
        2,
        5,
      );

      expect(map.getElevation(0, 0)).toBe(5);
      expect(map.getElevation(1, 3)).toBe(695);
      expect(map.getElevation(0, 2)).toBe(69);
    });
    test('Should return Infinity for out of bounds', () => {
      const map = new Map(
        [
          5, 8, 69, 9, 85,
          1, 0, 156, 695,
        ],
        2,
        5,
      );

      expect(map.getElevation(-1, 0)).toBe(Infinity);
      expect(map.getElevation(0, -1)).toBe(Infinity);
      expect(map.getElevation(2, 0)).toBe(Infinity);
      expect(map.getElevation(0, 5)).toBe(Infinity);
    });
  });
});
