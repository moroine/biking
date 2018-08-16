const { parse } = require('./parser');
const Map = require('../model/Map');

const map1 = require('../../fixtures/dataset_01/Map');
const map2 = require('../../fixtures/dataset_02/Map');
const map3 = require('../../fixtures/dataset_03/Map');
const mapExample = require('../../fixtures/example/Map');

const srcMap1 = require.resolve('../../fixtures/dataset_01/map.txt');
const srcMap2 = require.resolve('../../fixtures/dataset_02/map.txt');
const srcMap3 = require.resolve('../../fixtures/dataset_03/map.txt');
const srcMapExample = require.resolve('../../fixtures/example/map.txt');

describe('parser', () => {
  describe('.parse', () => {
    test('Should parse dataset 01', () => {
      const result = parse(srcMap1);

      expect(result).resolves.toBeInstanceOf(Map);
      expect(result).resolves.toEqual(map1);
    });
    test('Should parse dataset 02', () => {
      const result = parse(srcMap2);

      expect(result).resolves.toBeInstanceOf(Map);
      expect(result).resolves.toEqual(map2);
    });
    test('Should parse dataset 03', () => {
      const result = parse(srcMap3);

      expect(result).resolves.toBeInstanceOf(Map);
      expect(result).resolves.toEqual(map3);
    });
    test('Should parse dataset example', () => {
      const result = parse(srcMapExample);

      expect(result).resolves.toBeInstanceOf(Map);
      expect(result).resolves.toEqual(mapExample);
    });
  });
});
