const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  test('returns an array', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(Array.isArray(result)).toBe(true);
  });

  test('returns an array of the same length as the input array', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    expect(result).toHaveLength(inputArray.length);
  });

  test('contains all the same items as the input array', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    inputArray.forEach(item => {
      expect(result).toContain(item);
    });
  });

  test('shuffles the items in the array', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    expect(result).not.toEqual(inputArray);
  });
});
