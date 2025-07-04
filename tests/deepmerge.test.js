const { deepMerge } = require('../dist/index');

/**
 * Subset of `lodash.merge` tests
 * @see https://github.com/lodash/lodash/blob/master/test/merge.test.js
 */

describe('deepMerge', function () {
  it('should merge `source` into `object`', function () {
    var names = {
      'characters': [
        { 'name': 'barney' },
        { 'name': 'fred' }
      ]
    };

    var ages = {
      'characters': [
        { 'age': 36 },
        { 'age': 40 }
      ]
    };

    var heights = {
      'characters': [
        { 'height': '5\'4"' },
        { 'height': '5\'5"' }
      ]
    };

    var expected = {
      'characters': [
        { 'name': 'barney', 'age': 36, 'height': '5\'4"' },
        { 'name': 'fred', 'age': 40, 'height': '5\'5"' }
      ]
    };

    expect(deepMerge(names, ages, heights)).toStrictEqual(expected);
  });

  it('should work with four arguments', function () {
    var expected = { 'a': 4 },
      actual = deepMerge({ 'a': 1 }, { 'a': 2 }, { 'a': 3 }, expected);

    expect(actual).toStrictEqual(expected);
  });

  it('should merge onto function `object` values', function () {
    function Foo() { }

    var source = { 'a': 1 },
      actual = deepMerge(Foo, source);

    expect(actual).toStrictEqual(Foo);
    expect(Foo.a).toBe(1);
  });

  it('should merge first source object properties to function', function () {
    var fn = function () { },
      object = { 'prop': {} },
      actual = deepMerge({ 'prop': fn }, object);

    expect(actual).toStrictEqual(object);
  });

  it('should merge first and second source object properties to function', function () {
    var fn = function () { },
      object = { 'prop': {} },
      actual = deepMerge({ 'prop': fn }, { 'prop': fn }, object);

    expect(actual).toStrictEqual(object);
  });

  it('should not merge onto function values of sources', function () {
    var source1 = { 'a': function () { } },
      source2 = { 'a': { 'b': 2 } },
      expected = { 'a': { 'b': 2 } },
      actual = deepMerge({}, source1, source2);

    expect(actual).toStrictEqual(expected);
    expect(!('b' in source1.a)).toBe(true);

    actual = deepMerge(source1, source2);
    expect(actual).toStrictEqual(expected);
  });

  it('should merge onto non-plain `object` values', function () {
    class Foo { }

    var object = new Foo,
      actual = deepMerge(object, { 'a': 1 });

    expect(actual).toStrictEqual(object);
    expect(object.a).toBe(1);
  });

  it('should assign `null` values', function () {
    var actual = deepMerge({ 'a': 1 }, { 'a': null });
    expect(actual.a).toBeNull();
  });

  it('should not augment source objects', function () {
    var source1 = { 'a': [{ 'a': 1 }] },
      source2 = { 'a': [{ 'b': 2 }] },
      actual = deepMerge({}, source1, source2);

    expect(source1.a).toStrictEqual([{ 'a': 1 }]);
    expect(source2.a).toStrictEqual([{ 'b': 2 }]);
    expect(actual).toStrictEqual({ a: [{ 'a': 1, 'b': 2 }] });

    source1 = { 'a': [[1, 2, 3]] };
    source2 = { 'a': [[3, 4]] };
    actual = deepMerge({}, source1, source2);

    expect(source1.a).toStrictEqual([[1, 2, 3]]);
    expect(source2.a).toStrictEqual([[3, 4]]);
    expect(actual.a).toStrictEqual([[3, 4, 3]]);
  });

  it('should merge plain objects onto non-plain objects', function () {
    class Foo {
      constructor(object) {
        Object.assign(this, object);
      }
    }

    var object = { 'a': 1 },
      actual = deepMerge(new Foo, object);

    expect(actual instanceof Foo).toBe(true);
    expect(actual).toStrictEqual(new Foo(object));

    actual = deepMerge([new Foo], [object]);
    expect(actual[0] instanceof Foo).toBe(true);
    expect(actual).toStrictEqual([new Foo(object)]);
  });

  it('should not overwrite existing values with `undefined` values of object sources', function () {
    var actual = deepMerge({ 'a': 1 }, { 'a': undefined, 'b': undefined });
    expect(actual).toStrictEqual({ 'a': 1, 'b': undefined });
  });

  it('should not overwrite existing values with `undefined` values of array sources', function () {
    var array = [1];
    array[2] = 3;

    var actual = deepMerge([4, 5, 6], array),
      expected = [1, 5, 3];

    expect(actual).toStrictEqual(expected);

    array = [1, , 3];
    array[1] = undefined;

    actual = deepMerge([4, 5, 6], array);
    expect(actual).toStrictEqual(expected);
  });

  it('should skip merging when `object` and `source` are the same value', function () {
    var object = {},
      pass = true;

    Object.defineProperty(object, 'a', {
      'configurable': true,
      'enumerable': true,
      'get': function () { pass = false; },
      'set': function () { pass = false; }
    });

    deepMerge(object, object);
    expect(pass).toBe(true);
  });

  it('should convert strings to arrays when merging arrays of `source`', function () {
    var object = { 'a': 'abcde' },
      actual = deepMerge(object, { 'a': ['x', 'y', 'z'] });

    expect(actual).toStrictEqual({ 'a': ['x', 'y', 'z'] });
  });
});