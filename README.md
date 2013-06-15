# xrange.js
[![Build Status](https://travis-ci.org/gyllstromk/xrange.png?branch=master)](https://travis-ci.org/gyllstromk/xrange)

Javascript `xrange` / `range` function for node and browser.

`xrange` is based on the function of the same name from Python 2. It is a facility to iterate from `start` to `finish` by `increment` -- even downward -- without having to create a loop or array. Importantly, like the one in Python, `xrange` can be used completely as an iterator, with *no array* created.

# Usage

## Create with 1, 2, or 3 parameters

```js
xrange(3).toArray();        // -> [ 0, 1, 2 ];
xrange(1, 4).toArray();     // -> [ 1, 2, 3 ];
xrange(1, 6, 2).toArray();  // -> [ 1, 3, 5 ];
```

## Count downwards

Implied if second argument < first, but can also be set as 3rd parameter:

```js
xrange(5, 2).toArray();     // -> [ 5, 4, 3 ];
xrange(5, 0, -2).toArray(); // -> [ 5, 3, 1 ];
```

## Length

```js
xrange(5).length; // 5
xrange(0, 5, 2);  // 3
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

## Recipes

Create an array of 5 5's:

```js
var array = xrange(5).map(function () {
    return 5;
});
```

Use [async](https://github.com/caolan/async) like a `for` loop:

```js
async.each(
    xrange(1, 10),
    function(each, callback) {
        callback(null, each);
    }, function (err) {
        // finished ...
    }
);
```

# Installation

## Node

    npm install xrange

## Browser

    bower install xrange 
