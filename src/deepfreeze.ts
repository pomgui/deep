/**
 * Performs a recursive Object.freeze for all the objects in the parameter.
 * @param objects one or more objects to be freezed with the target
 * @returns the modified object or an array if there's more than one
 */
export function deepFreeze(...objects: object[]): object | object[] {
  const ret: any[] = [];
  for (const source of objects) {
    ret.push(freeze(source));
  }
  return ret.length == 1 ? ret[0] : ret;
}

function freeze(obj: any): any {
  if (!obj || typeof obj != 'object')
    return obj;
  for (const key in Object.getOwnPropertyNames(obj))
    freeze(obj[key]);
  return Object.freeze(obj);
}