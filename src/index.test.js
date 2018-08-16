const { fork } = require('child_process');

const testFile = (filePath, expected, done) => {
  const cmd = fork(
    './index',
    ['solve', filePath],
    {
      stdio: 'pipe',
      cwd: __dirname,
    },
  );

  let stderr = '';
  cmd.stderr.on('data', (data) => {
    stderr += data;
  });
  let stdout = '';
  cmd.stdout.on('data', (data) => {
    stdout += data;
  });

  cmd
    .on('close', (code) => {
      cmd.stderr.end();
      cmd.stdout.end();

      expect(stderr).toBeFalsy();
      expect(stdout).toBe(expected);

      expect(code).toBe(0);
      done();
    })
    .on('error', (err) => {
      throw err;
    });
};

describe('index', () => {
  test('dataset #01', (done) => {
    testFile(
      '../fixtures/dataset_01/map.txt',
      'Best path has size 1, starting at elevation 5 ending at elevation 5\n',
      done,
    );
  });
  test('dataset #02', (done) => {
    testFile(
      '../fixtures/dataset_02/map.txt',
      'Best path has size 8, starting at elevation 9 ending at elevation 1\n',
      done,
    );
  });
  test('dataset #03', (done) => {
    testFile(
      '../fixtures/dataset_03/map.txt',
      'Best path has size 6, starting at elevation 9 ending at elevation 1\n',
      done,
    );
  });
  test('dataset example', (done) => {
    testFile(
      '../fixtures/example/map.txt',
      'Best path has size 5, starting at elevation 9 ending at elevation 1\n',
      done,
    );
  });
});
