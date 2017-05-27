(function () {

    var XRange = function (start, finish, by) {
        this.length = Math.ceil((finish - start) / by);

        this.map = function (callback) {
            /**
             * Create array by executing `map` on each value.
             */

            var results = new Array(this.length);

            var value = start;

            for (var i = 0; i < this.length; i++) {
                results[i] = callback(value);
                value += by;
            }

            return results;
        };

        this.filter = function (callback) {
            /**
             * Create array of items that satisfy predicate function
             */

            var results = [];

            for (var i = start; i < finish; i += by) {
                if (callback(i)) {
                    results.push(i);
                }
            }
            return results;
        };

        this.reduce = function (callback, acc) {
            /**
             *  Reduces an xrange by specified callback
             */

            if (acc === undefined) {
                acc = start;
                start += by;
            }

            for (var i = start; i < finish; i += by) {
                acc = callback(acc, i);
            }
            return acc;
        };

        this.each = this.forEach = function (callback) {
            /**
             * Call `callback` on each item.
             *
             * If `callback` is false, stops loop.
             */

            for (var i = start; i < finish; i += by) {
                if (callback(i) === false) {
                    break;
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
