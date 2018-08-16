const fs = require('fs');
const Map = require('../model/Map');


const parse = filePath => new Promise((resolve, reject) => {
  try {
    const data = [];
    let rows = null;
    let cols = null;

    // To handle chunk ending on a middle of a number
    let rest = null;

    const regex = /[\n\t ]*([0-9]+)[\n\t ]*/gm;

    // use stream in order to keep low memory usage
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .on('data', (chunk) => {
        const str = rest ? `${rest}${chunk}` : chunk;
        let m = regex.exec(str);
        let loop = m !== null;

        rest = null;

        while (loop) {
          // The result can be accessed through the `m`-variable.
          const n = parseInt(m[1], 10);
          m = regex.exec(str);

          if (m !== null) {
            if (rows === null) {
              rows = n;
            } else if (cols === null) {
              cols = n;
            } else {
              data.push(n);
            }
          } else {
            rest = n;
            loop = false;
          }
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        data.push(rest);
        resolve(new Map(data, rows, cols));
      });
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  parse,
};
