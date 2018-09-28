/*globals Symbol*/
(function () {

    var XRange = function (start, finish, by) {
        this.length = Math.abs(Math.ceil((finish - start) / by));
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
             * Call `callback` on each item.
             *
             * If `callback` is false, stops loop.
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

        this.iterator = function () {
            var entryIterator = this.entries();
            var iterator = {
                next: function () {
                    var nextEntry = entryIterator.next();
                    if (nextEntry.done) {
                        return { done: true };
                    }
                    return { value: nextEntry.value[0] };
                }
            };
            return iterator;
        };

        this.every = function (callback) {
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
            var results = [];
            this.forEach(function (value, idx, range) {
                if (callback(value, idx, range)) {
                    results.push(value);
                }
            });
            return results;
        };

        this.findEntry = function (callback) {
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
            return this.findEntry(callback)[1];
        };

        this.findIndex = function (callback) {
            return this.findEntry(callback)[0];
        };

        this.includes = function (needle) {
            return this.some(function (value) {
                return value === needle;
            });
        };

        this.indexOf = function (needle) {
            return this.findIndex(function (value) {
                return value === needle;
            });
        };

        this.join = function (_sep) {
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
