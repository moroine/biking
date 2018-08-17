const Result = require('../model/Result');

class PathFinder {
  constructor(map) {
    this.map = map;

    this.cache = new Map();

    this.solutionBestResult = null;
  }

  solveFromStartPoint(row, column, parentElevation = null, parentSize = 0) {
    const current = this.map.getElevation(row, column);

    if (parentElevation !== null && current >= parentElevation) {
      return null;
    }

    // The best size we can achieve on this solution
    // considering the best overall solution and than elevation cannot be bellow 0
    const selfSizeLimit = parentSize + current + 1;
    if (this.solutionBestResult !== null && this.solutionBestResult.size > selfSizeLimit + 1) {
      return null;
    }

    const cacheResult = this.getCacheResult(row, column);

    if (cacheResult !== null) {
      return cacheResult;
    }

    const result = new Result(row, column, current);
    let bestSubResult = null;

    const topResult = this.solveFromStartPoint(row - 1, column, current, parentSize + 1);
    if (Result.isBetterResult(bestSubResult, topResult)) {
      bestSubResult = topResult;
    }

    const bottomResult = this.solveFromStartPoint(row + 1, column, current, parentSize + 1);
    if (Result.isBetterResult(bestSubResult, bottomResult)) {
      bestSubResult = bottomResult;
    }

    const leftResult = this.solveFromStartPoint(row, column - 1, current, parentSize + 1);
    if (Result.isBetterResult(bestSubResult, leftResult)) {
      bestSubResult = leftResult;
    }

    const rightResult = this.solveFromStartPoint(row, column + 1, current, parentSize + 1);
    if (Result.isBetterResult(bestSubResult, rightResult)) {
      bestSubResult = rightResult;
    }

    result.addSubResult(bestSubResult);

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
    for (let i = 0; i < this.map.rows; i += 1) {
      for (let j = 0; j < this.map.cols; j += 1) {
        const candidate = this.solveFromStartPoint(i, j);

        if (Result.isBetterResult(this.solutionBestResult, candidate)) {
          this.solutionBestResult = candidate;
        }
      }
    }

    return this.solutionBestResult;
  }
}

module.exports = PathFinder;
