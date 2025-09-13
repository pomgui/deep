const {patch, diff, deepMerge} = require('../dist/index');

describe("patch", () => {
  test("simple objects", () => {
    const a = { a: 1, b: 2 };
    const b = { a: 2, c: 3 };
    expect(patch(a, diff(a, b))).toEqual(b);
  });

  test("simple arrays", () => {
    const a = [1, 2, 3, 4, 5];
    const b = [1, 3, 5];
    expect(patch(a, diff(a, b))).toEqual(b);
  });

  test("overwriting values in the middle of path", () => {
    const a = {a: {b: null}};
    const d1 = {'=a.b.c': 10};
    patch(a, d1);
    expect(a).toEqual({a: {b: {c: 10}}});

    const a1 = {a: {b: null}};
    const d2 = {'=a.b.2': 10};
    patch(a1, d2);
    expect(a1).toEqual({a: {b: [undefined, undefined, 10]}});

    const a2 = {a: {b: null}};
    const d3 = {'=a.b.2.x': 10};
    patch(a2, d3);
    expect(a2).toEqual({a: {b: [undefined, undefined, {x:10}]}});
  });

  test("removing an unexistent path element", () => {
    const a = {a: {b: null}};
    const d1 = {'-a.b.c': 0};
    const p1 = patch(a, d1);
    expect(p1).toEqual(a); 

    const d2 = {'-a.b.c.d': 0};
    const p2 = patch(a, d2);
    expect(p2).toEqual(a); 

    const d3 = {'-a.x.2': 0};
    const p3 = patch(a, d3);
    expect(p3).toEqual(a); 
  });

  test("deep objects", () => {
    const a = {
      'foo.foo': {
        bar: {
          a: ["a", "b"],
          b: 2,
          c: ["x", "y"],
          e: 100,
        },
      },
      buzz: "world",
    };

    const b = {
      'foo.foo': {
        bar: {
          a: ["a"],
          b: 2,
          c: ["x", "y", "z"],
          d: "Hello, world!",
        },
      },
      buzz: "fizz",
    };
    expect(patch(a, diff(a, b))).toEqual(b);
  });
});