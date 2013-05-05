# xrange.js

Javascript `xrange` / `range`. function for node + browser.

`xrange` is based on the function of the same name from Python 2. It is a facility to iterate from `start` to `finish` by `increment` -- even downward -- without having to create a loop or array. Importantly, like the one in Python, `xrange` can be used completely as an iterator, with *no array* created.

# Usage

## Create with 1, 2, or 3 parameters

```js
xrange(3).toArray();        // -> [ 0, 1, 2 ];
xrange(1, 4).toArray();     // -> [ 1, 2, 3 ];
xrange(1, 5, 2).toArray();  // -> [ 1, 3, 5 ];
```

## Count downwards

If second argument < first:

```js
xrange(5, 2).toArray();     // -> [ 5, 4, 3 ];
xrange(5, 0, -2).toArray(); // -> [ 5, 3, 1 ];
```

## Iterators

### each/foreach

```js
var sum = 0;
xrange(3).each(function(each) {
    sum += each;
});

// or `forEach`
xrange(3).forEach(function(each) {
    sum += each;
});
```

### map

```js
var plusOne = xrange(3).map(function(each) {
    return each + 1;
});
```

# Installation

## Node

    npm install xrange

## Browser

    bower install xrange 
