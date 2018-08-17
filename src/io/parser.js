const fs = require('fs');
const MapModel = require('../model/MapModel');


class ParseHandler {
  constructor() {
    this.data = [];
    this.rows = null;
    this.cols = null;

    // To handle chunk ending on a middle of a number
    this.rest = null;
    this.regex = /([0-9]+)([\n\t ]*)/gm;
  }

  addChunck(chunk) {
    const str = this.rest ? `${this.rest}${chunk}` : chunk;
    let m = this.regex.exec(str);
    let loop = m !== null;

    this.rest = null;

    while (loop) {
      // The result can be accessed through the `m`-variable.
      const n = parseInt(m[1], 10);
      const isCompleteInt = Boolean(m[2]);
      m = this.regex.exec(str);

      if (m !== null) {
        if (this.rows === null) {
          this.rows = n;
        } else if (this.cols === null) {
          this.cols = n;
        } else {
          this.data.push(n);
        }
      } else {
        if (isCompleteInt) {
          this.data.push(n);
        } else {
          // Is not ending with a new-line or a space
          this.rest = n;
        }
        loop = false;
      }
    }
  }

  getResult() {
    this.data.push(this.rest);

    return new MapModel(this.data, this.rows, this.cols);
  }
}

const parse = filePath => new Promise((resolve, reject) => {
  try {
    const handler = new ParseHandler();

    // use stream in order to keep low memory usage
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .on('data', (chunk) => {
        handler.addChunck(chunk);
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve(handler.getResult());
      });
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  parse,
  ParseHandler,
};
