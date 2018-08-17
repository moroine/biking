const { parse } = require('./io/parser');
const PathFinder = require('./path/PathFinder');

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .command(
    'solve [file]',
    'Find the laziest biking path',
    yargs => yargs,
    (argv) => {
      parse(argv.file)
        .then((map) => {
          const finder = new PathFinder(map);
          const { size, endElevation, startElevation } = finder.solve();

          console.log(`Best path has size ${size}, starting at elevation ${startElevation} ending at elevation ${endElevation}`);
        })
        .catch(console.error);
    },
  )
  .help()
  .argv;
