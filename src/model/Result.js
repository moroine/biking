class Result {
  static getBestResult(results) {
    let best = null;

    results.forEach((result) => {
      if (this.isBetterResult(best, result)) {
        best = result;
      }
    });

    return best;
  }

  static isBetterResult(current, candidate) {
    if (current === null) {
      return true;
    }

    if (candidate === null) {
      return false;
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

  constructor(startRow, startColumn, startElevation) {
    this.path = [startRow, startColumn];
    this.size = 1;

    this.startElevation = startElevation;
    this.endElevation = startElevation;
  }

  addBestSubResult(results) {
    this.addSubResult(
      this.constructor.getBestResult(results),
    );
  }

  addSubResult(result) {
    if (result !== null) {
      this.size += result.size;
      this.path.push(...result.path);
      this.endElevation = result.endElevation;
    }
  }
}

module.exports = Result;
