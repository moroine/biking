class MapModel {
  constructor(data, rows, cols) {
    this.data = data;
    this.rows = rows;
    this.cols = cols;
  }

  getElevation(row, column) {
    if (row >= this.rows || row < 0) {
      return Infinity;
    }
    if (column >= this.cols || column < 0) {
      return Infinity;
    }
    return this.data[row * this.cols + column];
  }
}

module.exports = MapModel;
