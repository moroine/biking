class PathFinder {
  constructor(map) {
    this.map = map;

    this.cache = new Map();
  }

  static isBetterSubPath(current, candidate) {
    if (current === null) {
      return true;
    }

    if (candidate.size > current.size) {
      return true;
    }

    if (candidate.size < current.size) {
      return false;
    }

    const candidateDrop = candidate.endElevation - candidate.startElevation;
    const currentDrop = current.endElevation - current.startElevation;

    return candidateDrop < currentDrop;
  }

  solveFromStartPoint(row, column) {
    const cacheResult = this.getCacheResult(row, column);

    if (cacheResult !== null) {
      return cacheResult;
    }

    const current = this.map.getElevation(row, column);

    const topElevation = this.map.getElevation(row - 1, column);
    const leftElevation = this.map.getElevation(row, column - 1);
    const bottomElevation = this.map.getElevation(row + 1, column);
    const rightElevation = this.map.getElevation(row, column + 1);

    let bestSubPath = null;
    if (topElevation < current) {
      const top = this.solveFromStartPoint(row - 1, column);

      if (this.constructor.isBetterSubPath(bestSubPath, top)) {
        bestSubPath = top;
      }
    }
    if (leftElevation < current) {
      const left = this.solveFromStartPoint(row, column - 1);

      if (this.constructor.isBetterSubPath(bestSubPath, left)) {
        bestSubPath = left;
      }
    }
    if (bottomElevation < current) {
      const bottom = this.solveFromStartPoint(row + 1, column);

      if (this.constructor.isBetterSubPath(bestSubPath, bottom)) {
        bestSubPath = bottom;
      }
    }
    if (rightElevation < current) {
      const right = this.solveFromStartPoint(row, column + 1);

      if (this.constructor.isBetterSubPath(bestSubPath, right)) {
        bestSubPath = right;
      }
    }

    const result = {
      path: [row, column],
      size: 1,
      endElevation: current,
      startElevation: current,
    };

    if (bestSubPath !== null) {
      result.size += bestSubPath.size;
      result.path.push(...bestSubPath.path);
      result.endElevation = bestSubPath.endElevation;
    }

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

        if (this.constructor.isBetterSubPath(result, candidate)) {
          result = candidate;
        }
      }
    }

    return result;
  }
}

module.exports = PathFinder;
