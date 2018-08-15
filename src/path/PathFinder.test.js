const PathFinder = require('./PathFinder');

describe('PathFinder', () => {
  describe('constructor', () => {
    test('Should set map, cols & rows', () => {
      const map = [];
      const rows = 100;
      const cols = 89;

      const pathFinder = new PathFinder(map, rows, cols);

      expect(pathFinder.map).toBe(map);
      expect(pathFinder.cols).toBe(cols);
      expect(pathFinder.rows).toBe(rows);
    });
  });

  describe('.getElevation', () => {
    test('Should return the elevation at the coordinate', () => {
      const pathSection = new PathFinder(
        [
          5, 8, 69, 9, 85,
          1, 0, 156, 695,
        ],
        2,
        5,
      );

      expect(pathSection.getElevation(0, 0)).toBe(5);
      expect(pathSection.getElevation(1, 3)).toBe(695);
      expect(pathSection.getElevation(0, 2)).toBe(69);
    });
    test('Should return Infinity for out of bounds', () => {
      const pathSection = new PathFinder(
        [
          5, 8, 69, 9, 85,
          1, 0, 156, 695,
        ],
        2,
        5,
      );

      expect(pathSection.getElevation(-1, 0)).toBe(Infinity);
      expect(pathSection.getElevation(0, -1)).toBe(Infinity);
      expect(pathSection.getElevation(2, 0)).toBe(Infinity);
      expect(pathSection.getElevation(0, 5)).toBe(Infinity);
    });
  });

  describe('<static> .isBetterSubPath', () => {
    test('Should be true if current is null', () => {
      expect(PathFinder.isBetterSubPath(null, null)).toBe(true);
      expect(PathFinder.isBetterSubPath(null, { size: 0, path: [] })).toBe(true);
    });

    test('Should be true if candidate is longer path', () => {
      expect(PathFinder.isBetterSubPath(
        {
          size: 2,
          path: [
            1, 1,
            1, 2,
          ],
        },
        {
          size: 3,
          path: [
            3, 1,
            4, 1,
            2, 4,
          ],
        },
      )).toBe(true);
    });

    test('Should be false if candidate is shorter path', () => {
      expect(PathFinder.isBetterSubPath(
        {
          size: 3,
          path: [
            3, 1,
            4, 1,
            2, 4,
          ],
        },
        {
          size: 2,
          path: [
            1, 1,
            1, 2,
          ],
        },
      )).toBe(false);
    });

    test('Should be true if candidate and current are same size but candidate finish on lower ground', () => {
      expect(PathFinder.isBetterSubPath(
        {
          size: 3,
          path: [
            3, 1,
            4, 1,
            2, 4,
          ],
          endElevation: 5,
        },
        {
          size: 3,
          path: [
            1, 1,
            1, 2,
          ],
          endElevation: 2,
        },
      )).toBe(true);
    });

    test('Should be false if candidate and current are same size but candidate finish on higher ground', () => {
      expect(PathFinder.isBetterSubPath(
        {
          size: 3,
          path: [
            3, 1,
            4, 1,
            2, 4,
          ],
          endElevation: 5,
        },
        {
          size: 3,
          path: [
            1, 1,
            1, 2,
          ],
          endElevation: 9,
        },
      )).toBe(false);
    });
  });

  describe('.solveFromStartPoint', () => {
    test('Should returns size 1 for 1x1 map', () => {
      const map = [
        5,
      ];
      const rows = 1;
      const cols = 1;


      const pathFinder = new PathFinder(map, rows, cols);
      expect(pathFinder.solveFromStartPoint(0, 0)).toEqual({
        size: 1,
        path: [0, 0],
        endElevation: 5,
      });
    });

    test('Should find path of size 1', () => {
      const map = [
        9, 8, 7, 6,
        5, 2, 1, 4,
        6, 8, 2, 3,
      ];
      const rows = 3;
      const cols = 4;

      const pathFinder = new PathFinder(map, rows, cols);
      expect(pathFinder.solveFromStartPoint(1, 2)).toEqual({
        size: 1,
        path: [1, 2],
        endElevation: 1,
      });
    });

    test('Should find path of size 2', () => {
      const map = [
        9, 8, 7, 6,
        5, 2, 1, 4,
        6, 8, 2, 3,
      ];
      const rows = 3;
      const cols = 4;

      const pathFinder = new PathFinder(map, rows, cols);
      expect(pathFinder.solveFromStartPoint(1, 1)).toEqual({
        size: 2,
        path: [
          1, 1,
          1, 2,
        ],
        endElevation: 1,
      });
    });

    test('Should find path 8-5-3-2-1 in example', () => {
      const map = [
        4, 8, 7, 3,
        2, 5, 9, 3,
        6, 3, 2, 5,
        4, 4, 1, 6,
      ];
      const rows = 4;
      const cols = 4;

      const pathFinder = new PathFinder(map, rows, cols);
      expect(pathFinder.solveFromStartPoint(0, 1)).toEqual({
        size: 5,
        path: [
          0, 1,
          1, 1,
          2, 1,
          2, 2,
          3, 2,
        ],
        endElevation: 1,
      });
    });

    test('Should find path 9-5-3-2-1 in example', () => {
      const map = [
        4, 8, 7, 3,
        2, 5, 9, 3,
        6, 3, 2, 5,
        4, 4, 1, 6,
      ];
      const rows = 4;
      const cols = 4;

      const pathFinder = new PathFinder(map, rows, cols);
      expect(pathFinder.solveFromStartPoint(1, 2)).toEqual({
        size: 5,
        path: [
          1, 2,
          1, 1,
          2, 1,
          2, 2,
          3, 2,
        ],
        endElevation: 1,
      });
    });
  });

  describe('.solve', () => {
    test('Should solve example', () => {
      const map = [
        4, 8, 7, 3,
        2, 5, 9, 3,
        6, 3, 2, 5,
        4, 4, 1, 6,
      ];
      const rows = 4;
      const cols = 4;

      const pathFinder = new PathFinder(map, rows, cols);

      expect(pathFinder.solve()).toEqual({
        size: 5,
        path: [
          0, 1,
          1, 1,
          2, 1,
          2, 2,
          3, 2,
        ],
        endElevation: 1,
      });
    });

    test('Should maximize dropping', () => {
      const map = [
        8, 7, 6, 5, 4, 1,
        8, 8, 7, 6, 5, 7,
        9, 8, 7, 6, 5, 1,
        8, 8, 7, 6, 5, 7,
        8, 7, 6, 5, 4, 1,
      ];
      const rows = 5;
      const cols = 6;

      const pathFinder = new PathFinder(map, rows, cols);

      expect(pathFinder.solve()).toEqual({
        size: 6,
        path: [
          2, 0,
          2, 1,
          2, 2,
          2, 3,
          2, 4,
          2, 5,
        ],
        endElevation: 1,
      });
    });
  });
});
