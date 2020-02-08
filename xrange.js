/*globals Symbol*/
(function () {

    var XRange = function (start, finish, by) {
        var length = this.length = Math.abs(Math.ceil((finish - start) / by));
        var self = this;

        var cmp;
        if (start < finish) {
            cmp = function (i, finish) {
                return i < finish;
            };
        } else {
            cmp = function (i, finish) {
                return i > finish;
            };
        }

        this.map = function (callback) {
            /**
             * Create array by executing `map` on each value.
             */

            var results = [];

            this.forEach(function (value, idx, range) {
                results.push(callback(value, idx, range));
            });

            return results;
        };

        this.each = this.forEach = function (callback) {
            /**
             * Call `callback` on each item. The value of the item, the index of the
             * item in the range, and then the range itself are passed in as arguments
             * to the callback.
             *
             * If `callback` returns false, stops loop.
             */

            var iterator = this.entries();
            while (true) {
                var next = iterator.next();
                if (next.done) {
                    return;
                }
                if (callback(next.value[1], next.value[0], self) === false) {
                    return;
                }
            }
        };

        this.toArray = function () {
            /**
             * Create array.
             */

            return this.map(function (each) {
                return each;
            });
        };

        this.entries = function () {
            /**
             * Return an iterator over the two-tuple entries in the array like [index, value].
             */

            var i = start;
            var idx = 0;
            var iterator = {
                next: function () {
                    if (cmp(i, finish)) {
                        var currentValue = i;
                        var currentIdx = idx;
                        i += by;
                        idx += 1;
                        return { value: [currentIdx, currentValue] };
                    }
                    return { done: true };
                }
            };
            return iterator;
        };

        this.reversed = function () {
            /**
             * Return a *new* XRange object which has all the same values as this one, but in the reverse
             * order.
             */

            if (length === 0) {
                return new XRange(0, 0, 1);
            }
            var last = start + ((length - 1) * by);
            if (start < last) {
                return new XRange(last, start - 1, -by);
            }
            return new XRange(last, start + 1, -by);
        };

        this.transformIterator = function (callback) {
            /**
             * Return an iterator that iterates over the elements of this range (like `entries`), but
             * the values produced by the iterator are the results of passing values to the given callback.
             * Callback is called with the value, the index, and the XRange object itself, as with `each`.
             */

            var entryIterator = this.entries();
            var iterator = {
                next: function () {
                    var nextEntry = entryIterator.next();
                    if (nextEntry.done) {
                        return { done: true };
                    }
                    return { value: callback(nextEntry.value[1], nextEntry.value[0], self) };
                }
            };
            return iterator;
        };

        this.iterator = function () {
            /**
             * Return an iterator over the values of this range.
             */

            return this.transformIterator(function (value) {
                return value;
            });
        };

        this.keys = function () {
            /**
             * Return an iterator over the keys/numeric indices of this range.
             */

            return this.transformIterator(function (value, idx) {
                return idx;
            });
        };

        this.every = function (callback) {
            /**
             * Return true if and only if the given callback returns a truthy value for *every*
             * item in the range, false otherwise. Callback is called with value, index, XRange.
             * 
             * Not guaranteed to visit every item in all cases.
             */

            var every = true;
            this.forEach(function (value, idx, range) {
                var passed = callback(value, idx, range);
                if (!passed) {
                    every = false;
                    return false;
                }
            });
            return every;
        };

        this.some = function (callback) {
            /**
             * Return true if and only if the given callback returns a truthy value for *any*
             * item in the range, false otherwise. Callback is called with value, index, XRange.
             * 
             * Not guaranteed to visit every item in all cases.
             */

            var some = false;
            this.forEach(function (value, idx, range) {
                var passed = callback(value, idx, range);
                if (passed) {
                    some = true;
                    return false;
                }
            });
            return some;
        };

        this.filter = function (callback) {
            /**
             * Return an array of values from this range, in the same order, but only those for
             * which the given callback returns a truthy value. Callback is called with
             * value, index, XRange.
             */

            var results = [];
            this.forEach(function (value, idx, range) {
                if (callback(value, idx, range)) {
                    results.push(value);
                }
            });
            return results;
        };

        this.findEntry = function (callback) {
            /**
             * Find and return the first two-tuple entry in the range for which the callback returns
             * a truthy value. The returned entry is in the form [index, value]. If no matching
             * entry is found, returns [-1, undefined].
             * 
             * Callback is called with value, index, XRange.
             */

            var found = [-1, undefined];
            this.forEach(function (value, idx, range) {
                if (callback(value, idx, range)) {
                    found = [idx, value];
                    return false;
                }
            });
            return found;
        };

        this.find = function (callback) {
            /**
             * Find and return the first value in the range for which the callback returns
             * a truthy value. Returns 'undefined' if no match is found.
             * 
             * Callback is called with value, index, XRange.
             */

            return this.findEntry(callback)[1];
        };

        this.findIndex = function (callback) {
            /**
             * Return the index of the first value in the range for which the callback returns
             * a truthy value. Returns -1 if no match is found.
             * 
             * Callback is called with value, index, XRange.
             */

            return this.findEntry(callback)[0];
        };

        this.includes = function (needle) {
            /**
             * Returns true if and only if the given value is included in the values of this range,
             * false otherwise.
             */

            return this.some(function (value) {
                return value === needle;
            });
        };

        this.indexOf = function (needle) {
            /**
             * Returns the index of the given value in this range, or -1 if it isn't included in the range.
             */

            return this.findIndex(function (value) {
                return value === needle;
            });
        };

        this.join = function (_sep) {
            /**
             * Join the items of this range into a single string, in order, separated by the given string.
             * If called without an argument, an empty string is used as a separator.
             */

            var separator = _sep || '';
            var str = '';
            var last = this.length - 1;
            this.forEach(function (value, idx) {
                if (idx < last) {
                    str += value + separator;
                } else {
                    str += value;
                }
            });
            return str;
        };

        this.reduce = function (callback, initialValue) {
            /**
             * Reduce all the values in this range, in order, through the given callback, which is
             * called with acc, value, index, XRange, and is expected to return the next value of acc.
             * 
             * The initial value of acc is the given initialValue.
             * 
             * If no initialValue is given, then the first value in the range is used as the starting
             * value of acc, *and* the first item is skipped in iteration.
             * 
             * If the range is empty, returns initialValue, or throws an Error if initialValue is not
             * given.
             */

            var args = Array.prototype.slice.call(arguments);
            var hasInit = args.length > 1;
            if (this.length === 0) {
                if (hasInit) {
                    return initialValue;
                }
                throw new Error('Cannot reduce an empty range without an initial value');
            }
            var acc = hasInit ? initialValue : start;
            this.forEach(function (value, idx, range) {
                if (hasInit || idx > 0) {
                    acc = callback(acc, value, idx, range);
                }
            });
            return acc;
        };

        this.first = function () {
            /**
             * Return the first element in the range, or undefined if it's empty.
             */

            return length === 0 ? undefined : start;
        };

        this.isEmpty = function () {
            /**
             * Return true if and only if the length of the range is 0, meaning there
             * are no values included in the range. This only happens when the start and finish
             * are the same value.
             * 
             * Returns false otherwise.
             */

            return length === 0;
        };

        this.shifted = function (_amt) {
            /**
             * Returns a *new* XRange object which is the same as this range, but skips over the
             * first value. If an argument is given, it's the number of elements to skip, the default it
             * 1.
             * 
             * If the argument is negative, then it extends the range backward from the start by the specified number of
             * items.
             */

            var args = Array.prototype.slice.call(arguments);
            var amount = args.length > 0 ? _amt : 1;
            if (amount >= length) {
                return new XRange(0, 0, 1);
            }
            return new XRange(start + (amount * by), finish, by);
        };

        this.extended = function (_amt) {
            /**
             * Returns a *new* XRange object which is the same as this range, but adds an additional
             * value onto the end. If an argument is given, it's the number of elements to add, the default it
             * 1.
             * 
             * If the argument is negative, then it shrinks the range inward from the end by the specified number of
             * items.
             */

            var args = Array.prototype.slice.call(arguments);
            var amount = args.length > 0 ? _amt : 1;
            if (amount <= -length) {
                return new XRange(0, 0, 1);
            }
            return new XRange(start, finish + (amount * by), by);
        };

        if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
            this[Symbol.iterator] = this.iterator;
        }
    };

    var factory = function (start, finish, by) {
        /**
         * Create xrange object.
         */

        var args = Array.prototype.slice.call(arguments);

        if (args.length === 1) {
            finish = start;
            start = 0;
        }

        if (args.length <= 2) {
            by = finish > start ? 1 : -1;
        }

        if (by === 0) {
            throw new TypeError('Cannot iterate by 0');
        }

        if ((start < finish && by < 0) || start > finish && by > 0) {
            throw new TypeError('Cannot go from ' + start + ' to ' + finish +
                    ' by ' + by);
        }

        return new XRange(start, finish, by);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory;
    } else {
        window.xrange = factory;
    }

}());
