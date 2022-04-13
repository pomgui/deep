# Deep

Ultra small footprint merge & freeze methods.

### deepMerge
This method is like `assign` except that it recursively merges own and
inherited enumerable string keyed properties of source objects into the
destination object. Source properties that resolve to `undefined` are
skipped if a destination value exists. Array and plain object properties
are merged recursively. Other objects and value types are overridden by
assignment. Source objects are applied from left to right. Subsequent
sources overwrite property assignments of previous sources.

For the most cases it is compatible with 
[lodash.merge](https://www.npmjs.com/package/lodash.merge) package.

### deepFreeze
This method executes an recursive Object.freeze.

## Installation

Using npm:
```bash
$ {sudo -H} npm i -g npm
$ npm i --save @pomgui/deep
```

In Node.js:
```js
var { deepMerge } = require('@pomgui/deep');
```

With typescript:
 ```typescript
import { deepMerge } from '@pomgui/deep';
```

## Usage

### deepMerge

```js
const object = {
  'a': [{ 'b': 2 }, { 'd': 4 }]
}
const other = {
  'a': [{ 'c': 3 }, { 'e': 5 }]
}
deepMerge(object, other)
// => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }

### deepFreeze

const frozen = deepFreeze(obj);
// frozen === obj

const frozenArr = deepFreeze(obj1, obj2, obj3);
// frozenArr[0] === obj1
// frozenArr[1] === obj2
// frozenArr[2] === obj3

```
