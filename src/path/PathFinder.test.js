const PathFinder = require('./PathFinder');
const Map = require('../model/Map');

describe('PathFinder', () => {
  describe('constructor', () => {
    test('Should set map', () => {
      const map = new Map();

      const pathFinder = new PathFinder(map);

      expect(pathFinder.map).toBe(map);
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
          startElevation: 10,
        },
        {
          size: 3,
          path: [
            1, 1,
            1, 2,
            1, 3,
          ],
          endElevation: 2,
          startElevation: 10,
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
          startElevation: 10,
        },
        {
          size: 3,
          path: [
            1, 1,
            1, 2,
          ],
          endElevation: 9,
          startElevation: 10,
        },
      )).toBe(false);
    });

    test('Should be false if current has better dropping', () => {
      expect(PathFinder.isBetterSubPath(
        {
          size: 3,
          path: [
            3, 1,
            4, 1,
            2, 4,
          ],
          endElevation: 5,
          startElevation: 15,
        },
        {
          size: 3,
          path: [
            1, 1,
            1, 2,
            1, 3,
          ],
          endElevation: 2,
          startElevation: 3,
        },
      )).toBe(false);
    });

    test('Should be true if candidate has better dropping', () => {
      expect(PathFinder.isBetterSubPath(
        {
          size: 3,
          path: [
            1, 1,
            1, 2,
            1, 3,
          ],
          endElevation: 2,
          startElevation: 3,
        },
        {
          size: 3,
          path: [
            3, 1,
            4, 1,
            2, 4,
          ],
          endElevation: 5,
          startElevation: 15,
        },
      )).toBe(true);
    });
  });

  describe('.solveFromStartPoint', () => {
    test('Should returns size 1 for 1x1 data', () => {
      const map = new Map(
        [
          5,
        ],
        1,
        1,
      );

      const pathFinder = new PathFinder(map);
      expect(pathFinder.solveFromStartPoint(0, 0)).toEqual({
        size: 1,
        path: [0, 0],
        endElevation: 5,
        startElevation: 5,
      });
    });

    test('Should find path of size 1', () => {
      const map = new Map(
        [
          9, 8, 7, 6,
          5, 2, 1, 4,
          6, 8, 2, 3,
        ],
        3,
        4,
      );

      const pathFinder = new PathFinder(map);
      expect(pathFinder.solveFromStartPoint(1, 2)).toEqual({
        size: 1,
        path: [1, 2],
        endElevation: 1,
        startElevation: 1,
      });
    });

    test('Should find path of size 2', () => {
      const map = new Map(
        [
          9, 8, 7, 6,
          5, 2, 1, 4,
          6, 8, 2, 3,
        ],
        3,
        4,
      );

      const pathFinder = new PathFinder(map);
      expect(pathFinder.solveFromStartPoint(1, 1)).toEqual({
        size: 2,
        path: [
          1, 1,
          1, 2,
        ],
        endElevation: 1,
        startElevation: 2,
      });
    });

    test('Should find path 8-5-3-2-1 in example', () => {
      const map = new Map(
        [
          4, 8, 7, 3,
          2, 5, 9, 3,
          6, 3, 2, 5,
          4, 4, 1, 6,
        ],
        4,
        4,
      );

      const pathFinder = new PathFinder(map);
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
        startElevation: 8,
      });
    });

    test('Should find path 9-5-3-2-1 in example', () => {
      const map = new Map(
        [
          4, 8, 7, 3,
          2, 5, 9, 3,
          6, 3, 2, 5,
          4, 4, 1, 6,
        ],
        4,
        4,
      );

      const pathFinder = new PathFinder(map);
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
        startElevation: 9,
      });
    });
  });

  describe('.solve', () => {
    test('Should solve example', () => {
      const map = new Map(
        [
          4, 8, 7, 3,
          2, 5, 9, 3,
          6, 3, 2, 5,
          4, 4, 1, 6,
        ],
        4,
        4,
      );

      const pathFinder = new PathFinder(map);

      expect(pathFinder.solve()).toEqual({
        size: 5,
        path: [
          1, 2,
          1, 1,
          2, 1,
          2, 2,
          3, 2,
        ],
        endElevation: 1,
        startElevation: 9,
      });
    });

    test('Should maximize dropping', () => {
      const map = new Map(
        [
          8, 7, 6, 5, 4, 1,
          8, 8, 7, 6, 5, 7,
          9, 8, 7, 6, 5, 1,
          8, 8, 7, 6, 5, 7,
          8, 7, 6, 5, 4, 1,
        ],
        5,
        6,
      );

      const pathFinder = new PathFinder(map);

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
        startElevation: 9,
      });
    });
  });
});
