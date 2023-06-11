/**
 * Performs a merge of all the objects into the target.
 * It provides the almost same functionality that the 'lodash.merge'
 * npm package, with a very small footprint (1K vs 50K)
 * @see /tests/deepmerge.test.ts to see the considered use cases and examples
 * @param target  Object that may be altered with the merge procedure 
 * @param objects one or more objects to be merged with the target
 * @returns the modified target
 */
export function deepMerge<T>(target: T, ...objects: any[]): T {
  for (const source of objects) {
    if (target !== source)
      Object.entries(source).forEach(([key, sourceValue]) => {
        let targetValue = (target as any)[key];
        if (targetValue !== sourceValue || !(target as any).hasOwnProperty(key)) {
          if (typeof sourceValue === 'object' && sourceValue !== null) {
            if (Array.isArray(sourceValue) && !Array.isArray(targetValue))
              targetValue = (target as any)[key] = [];
            else if (typeof targetValue !== 'object')
              targetValue = (target as any)[key] = {};
            deepMerge(targetValue, sourceValue);
          } else if (targetValue === undefined || sourceValue !== undefined) {
            (target as any)[key] = sourceValue;
          }
        }
      })
  }
  return target;
}