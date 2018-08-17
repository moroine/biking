const Result = require('./Result');

describe('Result', () => {
  describe('constructor', () => {
    test('Should set path, size, startElevation & endElevation', () => {
      const result = new Result(42, 28, 35);

      expect(result.path).toEqual([42, 28]);
      expect(result.size).toBe(1);
      expect(result.startElevation).toBe(35);
      expect(result.endElevation).toBe(35);
    });
  });

  describe('<static> .isBetterResult', () => {
    test('Should be true if current is null', () => {
      expect(Result.isBetterResult(null, new Result(1, 2, 5))).toBe(true);
    });

    test('Should be false if candidate is null but not candidate', () => {
      expect(Result.isBetterResult(new Result(1, 2, 5), null)).toBe(false);
    });

    test('Should be true if candidate is longer path', () => {
      const current = new Result(1, 1, 5);
      current.path.push(1, 2);
      current.size += 1;

      const candidate = new Result(3, 1, 5);
      candidate.path.push(4, 1, 2, 4);
      candidate.size += 2;


      expect(Result.isBetterResult(current, candidate)).toBe(true);
    });

    test('Should be false if candidate is shorter path', () => {
      const current = new Result(1, 1, 5);
      current.path.push(4, 1, 2, 4);
      current.size += 2;

      const candidate = new Result(3, 1, 5);
      candidate.path.push(1, 2);
      candidate.size += 1;

      expect(Result.isBetterResult(current, candidate)).toBe(false);
    });

    test('Should be true if candidate and current are same size but candidate finish on lower ground', () => {
      const current = new Result(3, 1, 10);
      current.path.push(4, 1, 2, 4);
      current.size += 2;
      current.endElevation = 5;

      const candidate = new Result(1, 1, 10);
      candidate.path.push(1, 2, 1, 3);
      candidate.size += 2;
      candidate.endElevation = 2;

      expect(Result.isBetterResult(current, candidate)).toBe(true);
    });

    test('Should be false if candidate and current are same size but candidate finish on higher ground', () => {
      const current = new Result(3, 1, 10);
      current.path.push(4, 1, 2, 4);
      current.size += 2;
      current.endElevation = 5;

      const candidate = new Result(1, 1, 10);
      candidate.path.push(1, 2, 1, 3);
      candidate.size += 2;
      candidate.endElevation = 8;

      expect(Result.isBetterResult(current, candidate)).toBe(false);
    });

    test('Should be false if current has better dropping', () => {
      const current = new Result(3, 1, 28);
      current.path.push(4, 1, 2, 4);
      current.size += 2;
      current.endElevation = 5;

      const candidate = new Result(1, 1, 10);
      candidate.path.push(1, 2, 1, 3);
      candidate.size += 2;
      candidate.endElevation = 2;

      expect(Result.isBetterResult(current, candidate)).toBe(false);
    });

    test('Should be true if candidate has better dropping', () => {
      const current = new Result(3, 1, 10);
      current.path.push(4, 1, 2, 4);
      current.size += 2;
      current.endElevation = 5;

      const candidate = new Result(1, 1, 23);
      candidate.path.push(1, 2, 1, 3);
      candidate.size += 2;
      candidate.endElevation = 12;
    });
  });

  describe('<static>.getBestResult', () => {
    test('Should return null for empty array', () => {
      expect(Result.getBestResult([])).toBe(null);
    });

    test('Should return null for array of null', () => {
      expect(Result.getBestResult([null, null, null])).toBe(null);
    });

    test('Should return the best result', () => {
      const a = new Result(1, 1, 23);
      a.path.push(1, 2, 1, 3);
      a.size += 2;
      a.endElevation = 12;

      const b = new Result(3, 1, 10);
      b.path.push(4, 1, 2, 4);
      b.size += 2;
      b.endElevation = 5;

      const c = new Result(1, 2, 5);

      expect(Result.getBestResult([
        null,
        a,
        null,
        b,
        c,
      ])).toBe(a);
    });
  });

  describe('.addSubResult', () => {
    test('Should do nothing if null', () => {
      const a = new Result(1, 1, 23);
      a.addSubResult(null);
      expect(a).toEqual(new Result(1, 1, 23));
    });

    test('Should happen the result', () => {
      const a = new Result(1, 1, 23);
      a.addSubResult(new Result(3, 1, 10));

      expect(a.path).toEqual([1, 1, 3, 1]);
      expect(a.size).toEqual(2);
      expect(a.startElevation).toEqual(23);
      expect(a.endElevation).toEqual(10);
    });
  });

  describe('.addBestSubResult', () => {
    test('Should only add the best result', () => {
      const a = new Result(1, 1, 23);
      a.path.push(1, 2, 1, 3);
      a.size += 2;
      a.endElevation = 12;

      const b = new Result(3, 1, 10);
      b.path.push(4, 1, 2, 4);
      b.size += 2;
      b.endElevation = 5;

      const c = new Result(1, 2, 5);

      a.addBestSubResult([null, b, c]);

      expect(a.path).toEqual([1, 1, 1, 2, 1, 3, 3, 1, 4, 1, 2, 4]);
      expect(a.size).toEqual(6);
      expect(a.startElevation).toEqual(23);
      expect(a.endElevation).toEqual(5);
    });
  });
});
