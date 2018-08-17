const PathFinder = require('./PathFinder');
const MapModel = require('../model/MapModel');

const map1 = require('../../fixtures/dataset_01/Map');
const map2 = require('../../fixtures/dataset_02/Map');
const map3 = require('../../fixtures/dataset_03/Map');
const mapExample = require('../../fixtures/example/Map');

describe('PathFinder', () => {
  describe('constructor', () => {
    test('Should set map', () => {
      const map = new MapModel();

      const pathFinder = new PathFinder(map);

      expect(pathFinder.map).toBe(map);
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
    test('Should dataset #01', () => {
      const pathFinder = new PathFinder(map1);

      expect(pathFinder.solve()).toEqual({
        size: 1,
        path: [0, 0],
        endElevation: 5,
        startElevation: 5,
      });
    });

    test('Should dataset #02', () => {
      const pathFinder = new PathFinder(map2);

      expect(pathFinder.solve()).toEqual({
        size: 8,
        path: [
          0, 0,
          0, 1,
          0, 2,
          0, 3,
          1, 3,
          2, 3,
          2, 2,
          1, 2,
        ],
        endElevation: 1,
        startElevation: 9,
      });
    });
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

    test('Should dataset #03', () => {
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
