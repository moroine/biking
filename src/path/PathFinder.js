class PathFinder {
  constructor(map, rows, cols) {
    this.map = map;
    this.rows = rows;
    this.cols = cols;
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

    return candidate.endElevation < current.endElevation;
  }

  getElevation(row, column) {
    if (row >= this.rows || row < 0) {
      return Infinity;
    }
    if (column >= this.cols || column < 0) {
      return Infinity;
    }
    return this.map[row * this.cols + column];
  }

  solveFromStartPoint(row, column) {
    const current = this.getElevation(row, column);

    const topElevation = this.getElevation(row - 1, column);
    const leftElevation = this.getElevation(row, column - 1);
    const bottomElevation = this.getElevation(row + 1, column);
    const rightElevation = this.getElevation(row, column + 1);

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
    };

    if (bestSubPath !== null) {
      result.size += bestSubPath.size;
      result.path.push(...bestSubPath.path);
      result.endElevation = bestSubPath.endElevation;
    }

    return result;
  }

  solve() {
    let result = null;

    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
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
