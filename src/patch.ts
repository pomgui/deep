import { deepMerge } from "./deepmerge";
import { DiffResult } from "./diff";

/**
 * You can apply the diff result onto the original object to get the modified object.
 *
 * Some portions of this file is derivated from https://github.com/Open-Tech-Foundation/obj-diff/blob/main/packages/obj-diff/src/patch.ts
 * to use our version of diff.
 * 
 * @example
 * const a = {a: 1, b: 2};
 * const b = {a: 2, c: 3};
 * const out = patch(a, diff(a, b));
 * assert.deepStrictEqual(out, b); // ok
 */
export function patch<T>(obj: T, patches: DiffResult): T {
    const c = deepMerge(obj);

    for (const p in patches) {
        if (p[1] == ':') {
            if (p[0] == 'A' || p[0] == 'C') {
                set(c, p.substring(2), patches[p]);
            }

            if (p[0] == 'D') {
                unset(c, p.substring(2));
            }
        }
    }

    return c;
}

function set(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const k2 = keys[i + 1];
        if (!(k in obj)) obj[k] = /^\d+$/.test(k2) ? [] : {};
        obj = obj[k];
    }
    obj[lastKey] = value;
}

function unset(obj: any, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (!(k in obj)) return;
        obj = obj[k];
    }
    delete obj[lastKey];
}