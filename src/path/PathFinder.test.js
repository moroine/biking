const PathFinder = require('./PathFinder');
const Map = require('../model/Map');

const map1 = require('../../fixtures/dataset_01/Map');
const map2 = require('../../fixtures/dataset_02/Map');
const map3 = require('../../fixtures/dataset_03/Map');
const mapExample = require('../../fixtures/example/Map');

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
    test('Should returns size 1 for map1 at (0, 0)', () => {
      const pathFinder = new PathFinder(map1);
      expect(pathFinder.solveFromStartPoint(0, 0)).toEqual({
        size: 1,
        path: [0, 0],
        endElevation: 5,
        startElevation: 5,
      });
    });

    test('Should find path of size 1 for map2 at (1, 2)', () => {
      const pathFinder = new PathFinder(map2);
      expect(pathFinder.solveFromStartPoint(1, 2)).toEqual({
        size: 1,
        path: [1, 2],
        endElevation: 1,
        startElevation: 1,
      });
    });

    test('Should find path of size 2 for map2 at (1, 1)', () => {
      const pathFinder = new PathFinder(map2);
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

    test('Should find path 8-5-3-2-1 in example at (0, 1)', () => {
      const pathFinder = new PathFinder(mapExample);
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

    test('Should find path 9-5-3-2-1 in example at (1, 2)', () => {
      const pathFinder = new PathFinder(mapExample);
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
      const pathFinder = new PathFinder(mapExample);

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
      const pathFinder = new PathFinder(map3);

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
