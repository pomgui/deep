export type DiffResult = Record<string, any>;

/**
 * Function derivated from https://github.com/Open-Tech-Foundation/obj-diff/blob/main/packages/obj-diff/src/diff.ts
 * and changed to return a smaller data length
 */
function objDiff(
    a: object,
    b: object,
    path: string,
    _refs: WeakSet<WeakKey>
): DiffResult {
    let result: DiffResult = {};

    if (
        typeof a === "object" &&
        typeof b === "object" &&
        a !== null &&
        b !== null
    ) {
        // For circular refs
        if (_refs.has(a) && _refs.has(b)) {
            return {};
        }

        _refs.add(a as WeakKey);
        _refs.add(b as WeakKey);

        if (Array.isArray(a) && Array.isArray(b)) {
            for (let i = 0; i < a.length; i++) {
                const apath = getSubPath(path, i);
                if (Object.hasOwn(b, i)) {
                    Object.assign(result, objDiff(
                        a[i],
                        (b as Array<unknown>)[i] as object,
                        apath,
                        _refs
                    )
                    );
                } else
                    result['-' + apath] = 0;
            }

            for (let i = 0; i < (b as []).length; i++)
                if (!Object.hasOwn(a, i)) {
                    const apath = getSubPath(path, i);
                    result['+' + apath] = (b as Array<unknown>)[i];
                }

            _refs.delete(a);
            _refs.delete(b);

            return result;
        }

        if (
            Object.prototype.toString.call(a) === "[object Object]" &&
            Object.prototype.toString.call(b) === "[object Object]"
        ) {
            for (const k in a) {
                const apath = getSubPath(path, k);
                if (Object.hasOwn(b, k)) {
                    Object.assign(result, objDiff(
                        (a as Record<string, unknown>)[k] as object,
                        (b as Record<string, unknown>)[k] as object,
                        apath,
                        _refs
                    ));
                } else {
                    result['-' + apath] = 0;
                }
            }

            for (const k of Object.keys(b))
                if (!Object.hasOwn(a, k)) {
                    const apath = getSubPath(path, k);
                    result['+' + apath] = (b as Record<string, unknown>)[k];
                }

            _refs.delete(a);
            _refs.delete(b);

            return result;
        }

        if (a instanceof Date && b instanceof Date) {
            if (!Object.is(a.getTime(), b.getTime()))
                return { ['=' + path]: b };
        }

        if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b))
            return { ['=' + path]: b };

    } else
        if (!Object.is(a, b))
            return { ['=' + path]: b };

    return result;
}

function getSubPath(path: string, sub: string|number): string {
    const subkey = typeof sub=='string'? sub.replace('.', '\\.'): sub.toString();
    if (path != '') return path + '.' + subkey;
    else return subkey;
}

/**
 * Performs a deep difference between two objects.
 *
 * @example
 * diff({a: 1}, {a: 5}) //=> [{t: 2, p: ['a'], v: 5}]
 */
export function diff(obj1: object, obj2: object): DiffResult {
    return objDiff(obj1, obj2, '', new WeakSet());
}