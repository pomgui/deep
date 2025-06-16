const { deepMerge } = require('../dist/deepmerge');
const { diff } = require('../dist/diff');

describe("diff", () => {
    test("no params", () => {
        expect(diff()).toEqual({});
    });

    test("same type of non objects", () => {
        expect(diff(undefined, undefined)).toEqual({});
        expect(diff(null, null)).toEqual({});
        expect(diff(0, 0)).toEqual({});
        expect(diff(1, 1)).toEqual({});
        expect(diff(1n, 1n)).toEqual({});
        expect(diff(NaN, NaN)).toEqual({});
        expect(diff("a", "a")).toEqual({});
        expect(diff("App", "Apples")).toEqual({'C:': 'Apples'});
        expect(diff(true, true)).toEqual({});
        expect(diff(false, false)).toEqual({});
        expect(diff(1000, NaN)).toEqual({'C:':NaN });
    });

    test("different type of non objects", () => {
        expect(diff(undefined, null)).toEqual({'C:':null });
        expect(diff(1, "1")).toEqual({'C:': "1" });
        expect(diff(1, true)).toEqual({'C:': true });
    });

    test("compare object with null", () => {
        expect(diff({}, null)).toEqual({'C:': null });
        expect(diff(null, { a: 1 })).toEqual({'C:': { a: 1 }});
    });

    test("empty objects", () => {
        expect(diff([], [])).toEqual({});
        expect(diff({}, {})).toEqual({});
        expect(diff(Object.create(null), Object.create(null))).toEqual({});
    });

    test("dates", () => {
        expect(
            diff({ date: new Date("2024-01-01") }, { date: new Date("2024-01-01") })
        ).toEqual({});
        expect(
            diff({ date: new Date("2024-01-01") }, { date: new Date("2024-01-02") })
        ).toEqual({'C:date':new Date("2024-01-02")});
    });

    test("array", () => {
        expect(diff([], [1])).toEqual({'A:0': 1 });
        expect(diff([1], [2])).toEqual({'C:0': 2 });
        expect(diff([1], [])).toEqual({'D:0':0 });
        expect(diff([1, 2, 3], [1, 2, 3, 4, 5])).toEqual({'A:3':4, 'A:4':5});
        expect(diff([1, 2, 3, 4, 5], [1, 3, 5])).toEqual({ 'C:1': 3, 'C:2': 5, 'D:3': 0, 'D:4': 0 });
    });

    test("array deep", () => {
        expect(diff([1, 2, [3], 4, 5], [1, 2, [4], 4, 5])).toEqual({ 'C:2.0': 4 });

        expect(
            diff([1, 2, [3, 6, [1, 2, 3]], 4, 5], [1, 2, [3, 5, [7, 2]], 4, 5, 6])
        ).toEqual({ 'C:2.1': 5, 'C:2.2.0': 7, 'D:2.2.2': 0, 'A:5': 6 });
    });

    test("objects", () => {
        expect(diff({ a: undefined }, { a: undefined })).toEqual({});
        expect(diff({ a: undefined }, {})).toEqual({ 'D:a': 0 });
        expect(diff({ a: 1 }, { a: 1 })).toEqual({});
        expect(diff({ a: 1 }, { a: 2 })).toEqual({ 'C:a': 2 });
        expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual({ 'A:b': 2 });
        expect(diff({ a: 1 }, {})).toEqual({ 'D:a': 0 });
        expect(diff({ a: 1, b: 2 }, { a: 2, c: 5 })).toEqual({ 'C:a': 2, 'D:b': 0, 'A:c': 5 });
    });

    test("deep objects", () => {
        const lhs = {
            foo: {
                bar: {
                    a: ["a", "b"],
                    b: 2,
                    c: ["x", "y"],
                    e: 100, // deleted
                },
            },
            buzz: "world",
        };

        const rhs = {
            foo: {
                bar: {
                    a: ["a"], // index 1 ('b')  deleted
                    b: 2, // unchanged
                    c: ["x", "y", "z"], // 'z' added
                    d: "Hello, world!", // added
                },
            },
            buzz: "fizz", // updated
        };

        expect(diff(lhs, rhs)).toEqual({
            'D:foo.bar.a.1': 0,
            'A:foo.bar.c.2': 'z',
            'D:foo.bar.e': 0,
            'A:foo.bar.d': 'Hello, world!',
            'C:buzz': 'fizz'
        });

        const obj1 = {
            id: 8,
            title: "Microsoft Surface Laptop 4",
            description: "Style and speed. Stand out on ...",
            price: 1499,
            discountPercentage: 10.23,
            rating: 4.43,
            stock: { inStock: true, count: 68 },
            brand: "Microsoft Surface",
            category: "laptops",
            resources: {
                images: {
                    thumbnail: "https://cdn.dummyjson.com/product-images/8/thumbnail.jpg",
                    items: [
                        "https://cdn.dummyjson.com/product-images/8/1.jpg",
                        "https://cdn.dummyjson.com/product-images/8/2.jpg",
                        "https://cdn.dummyjson.com/product-images/8/3.jpg",
                        "https://cdn.dummyjson.com/product-images/8/4.jpg",
                        "https://cdn.dummyjson.com/product-images/8/thumbnail.jpg",
                    ],
                },
            },
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-02"),
        };

        const obj2 = {
            id: 8,
            title: "Microsoft Surface Laptop 4",
            description: "Style and speed. Stand out on.",
            price: 1599,
            discountPercentage: 10.23,
            rating: 4.43,
            stock: { inStock: true, count: 18 },
            brand: "Microsoft Surface",
            category: "laptops",
            resources: {
                images: {
                    thumbnail: "https://cdn.dummyjson.com/product-images/8/thumbnail.jpg",
                    items: [
                        "https://cdn.dummyjson.com/product-images/8/1.jpg",
                        "https://cdn.dummyjson.com/product-images/8/2.jpg",
                        "https://cdn.dummyjson.com/product-images/8/3.jpg",
                        "https://cdn.dummyjson.com/product-images/8/4.jpg",
                    ],
                },
            },
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-03"),
        };

        expect(diff(obj1, obj2)).toEqual({
            'C:description': 'Style and speed. Stand out on.',
            'C:price': 1599,
            'C:stock.count': 18,
            'D:resources.images.items.4': 0,
            'C:updatedAt': new Date("2024-01-03")
        });
    });

    test("circular refs", () => {
        let obj1 = {
            a: 1,
        };
        obj1.self = obj1;
        let obj2 = structuredClone(obj1);
        expect(diff(obj1, obj2)).toEqual({});

        obj1 = {
            a: 1,
        };
        obj1.self = obj1;
        obj2 = structuredClone(obj1);
        obj2.self = null;
        expect(diff(obj1, obj2)).toEqual({ 'C:self': null });

        const tmp = { a: 1 };
        obj1 = { a: { tmp }, b: { tmp } };
        obj2 = structuredClone(obj1);
        obj2.a.tmp.b = 2;

        expect(diff(obj1, obj2)).toEqual({ 'A:a.tmp.b': 2, 'A:b.tmp.b': 2 });

        obj1 = { a: { b: 2, c: [1, 2, 3] } };
        obj1.b = obj1;
        obj2 = { a: { b: 2, c: [1, 5, 3] } };
        obj2.b = obj2;
        expect(diff(obj1, obj2)).toEqual({ 'C:a.c.1': 5 });
    });

    test("multiple references to the same object", () => {
        const array = [1];
        const array2=[1];
        const a = { test1: array, test2: array };
        const b = { test1: array2, test2: array2 };
        b.test1.push(2);
        expect(diff(a, b)).toEqual({ 'A:test1.1': 2, 'A:test2.1': 2 });
    });
});