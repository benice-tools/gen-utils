# gen-utils

> Utils for working with es6 generators

## Install

```
$ npm install gen-utils
```


## Usage

### flatten 
If provided generator yields another generator object, it will
embed yielded generator into original one.
So you can use just yield generator() instead of yield* generator()

```js
const {
  flatten,
} = require('gen-utils');

function* child() {
  yield 2;
}

function* generatorFn() {
  // embed other generator without *
  yield child();

  return 10
}

const g = flatten(generatorFn());
console.log(g.next()); // { value: 2, done: false }
console.log(g.next()); // { value: 10, done: true }
```

### mapIn 
Maps generator inputs

```js
const {
  mapIn,
} = require('gen-utils');

function* generatorFn() {
  yield yield 1;
  yield yield 2;
}

const g = mapIn(generatorFn(), x => x*2);

console.log(g.next()); // { done: false, value: 1 }
console.log(g.next(10)); // { done: false, value 20 }
console.log(g.next()); // { done: false, value: 2 }
console.log(g.next(20)); // { done: false, value 40 }
```

### mapOut
Maps generator outputs. You can also change "done" property of the result

```js
function* generatorFn() {
  yield 1;
  return 2;
}

const g = mapOut(generatorFn(), ({ done, value }) => ({
  done: true, // override done
  value: value * 2
}));

console.log(g.next()); // { done: true, value: 2 }
console.log(g.next()); // { done: true, value: undefined }
```

## Bonus

Combine flatten with mapOut to violate functor laws

```js
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}

const g = flatten(
  mapOut(
    generatorFn(),
    ({ done, value }) => ({
      done,
      value: (function* () {
        for (let i = 0; i < value; i += 1) {
          yield value;
        }
      })()
    })
  )
);

for (const value of g) {
  console.log(value);
}
/*
1
2
2
3
3
3
*/
```
