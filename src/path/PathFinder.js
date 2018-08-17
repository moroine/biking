const Result = require('../model/Result');

class PathFinder {
  constructor(map) {
    this.map = map;

    this.cache = new Map();
  }

  solveFromStartPoint(row, column) {
    const cacheResult = this.getCacheResult(row, column);

    if (cacheResult !== null) {
      return cacheResult;
    }

    const current = this.map.getElevation(row, column);

    const subCoordinates = [
      {
        row: row - 1,
        column,
      },
      {
        row: row + 1,
        column,
      },
      {
        row,
        column: column - 1,
      },
      {
        row,
        column: column + 1,
      },
    ];

    const subResults = subCoordinates.map((coord) => {
      const elevation = this.map.getElevation(coord.row, coord.column);

      return elevation < current ? this.solveFromStartPoint(coord.row, coord.column) : null;
    });

    const result = new Result(row, column, current);
    result.addBestSubResult(subResults);

    return this.cacheResult(row, column, result);
  }

  cacheResult(row, column, result) {
    if (!this.cache.has(row)) {
      this.cache.set(row, new Map());
    }

    const rowCache = this.cache.get(row);
    if (!rowCache.has(column)) {
      rowCache.set(column, result);
    }

    return result;
  }

  getCacheResult(row, column) {
    if (!this.cache.has(row)) {
      return null;
    }

    const rowCache = this.cache.get(row);
    if (!rowCache.has(column)) {
      return null;
    }

    return rowCache.get(column);
  }

  solve() {
    let result = null;

    for (let i = 0; i < this.map.rows; i += 1) {
      for (let j = 0; j < this.map.cols; j += 1) {
        const candidate = this.solveFromStartPoint(i, j);

        if (Result.isBetterResult(result, candidate)) {
          result = candidate;
        }
      }
    }

    return result;
  }
}

module.exports = PathFinder;
