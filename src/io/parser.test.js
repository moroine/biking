/* eslint-disable no-trailing-spaces */
const { parse, ParseHandler } = require('./parser');
const MapModel = require('../model/Map');

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

      expect(result).resolves.toBeInstanceOf(MapModel);
      expect(result).resolves.toEqual(map1);
    });
    test('Should parse dataset 02', () => {
      const result = parse(srcMap2);

      expect(result).resolves.toBeInstanceOf(MapModel);
      expect(result).resolves.toEqual(map2);
    });
    test('Should parse dataset 03', () => {
      const result = parse(srcMap3);

      expect(result).resolves.toBeInstanceOf(MapModel);
      expect(result).resolves.toEqual(map3);
    });
    test('Should parse dataset example', () => {
      const result = parse(srcMapExample);

      expect(result).resolves.toBeInstanceOf(MapModel);
      expect(result).resolves.toEqual(mapExample);
    });
  });

  describe('.ParseHandler', () => {
    test('Should support integer split in multi-chunk', () => {
      const handler = new ParseHandler();

      handler.addChunck('3 3 \n1 22 333\n4444 55');
      handler.addChunck('555 666666\n');
      handler.addChunck('7777777 88888888 999999999');

      expect(handler.getResult()).toEqual(
        new MapModel(
          [
            1, 22, 333,
            4444, 55555, 666666,
            7777777, 88888888, 999999999,
          ],
          3,
          3,
        ),
      );
    });
  });
});
