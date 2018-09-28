/*globals describe,it,Symbol*/

if (typeof module !== 'undefined') {
    var xrange = require('../index');

    var assert = require('assert');
} else {
    var assertOk = function (value) {
        if (value) {
            throw new Error('AssertionError');
        }
    };
    var assert = function (value) {
        assertOk(value);
    };
    Object.assign(assert, {
        ok: assertOk,

        throws: function (thrower, catcher) {
            try {
                thrower();
            } catch (error) {
                if (! catcher.test(error)) {
                    throw new Error('AssertionError');
                }
            }
        },

        strictEqual: function (a, b) {
            if (a !== b) {
                throw new Error(a + ' !== ' + b);
            }
        },

        deepEqual: function (a, b) {
            for (var i = 0, ii = a.length; i < ii; i++) {
                if (a[i] !== b[i]) {
                    throw new Error('AssertionError');
                }
            }
        }
    });
}

assert.xrangeLengthEqual = function (xObj) {
    assert.strictEqual(xObj.length, xObj.toArray().length);
};

describe('Test xrange', function () {
    var zero2three = [ 0, 1, 2, 3 ];
    var zero2MinusThree = [0, -1, -2, -3];

    describe('Parameters', function () {
        describe('Invalid', function () {
            it('fails when by === 0', function () {
                assert.throws(function () {
                    xrange(0, 4, 0);
                }, /TypeError.*0/);
            });

            it('fails when by === negative and direction positive', function () {
                assert.throws(function () {
                    xrange(0, 4, -1);
                }, /TypeError.*by/);
            });

            it('fails when by === positive and direction negative', function () {
                assert.throws(function () {
                    xrange(4, 0, 1);
                }, /TypeError.*by/);
            });
        });

        it('lengths', function  () {
            var rng = 20;
            for (var to = -rng - 1; to < rng; to++) {
                assert.xrangeLengthEqual(xrange(to));
                assert.xrangeLengthEqual(xrange(- to));

                for (var from = -rng; from < to; from++) {
                    assert.xrangeLengthEqual(xrange(from, to));
                    assert.xrangeLengthEqual(xrange(to, from));

                    for (var by = 1; by < to; by++) {
                        assert.xrangeLengthEqual(xrange(from, to, by));
                        assert.xrangeLengthEqual(xrange(to, from, -by));
                    }
                }
            }
        });

        describe('Counts', function () {
            it('xrange with 1 param', function () {
                assert.deepEqual(xrange(4).toArray(), zero2three);
            });

            it('xrange with 2 param', function () {
                for (var i = 0; i < 4; i++) {
                    assert.deepEqual(xrange(i, 4).toArray(), zero2three.slice(i));
                    assert.deepEqual(xrange(3, i - 1).toArray().reverse(),
                        zero2three.slice(i));
                }
            });

            it('xrange with 3 param', function () {
                assert.deepEqual(xrange(0, 4, 1).toArray(), zero2three);
                assert.deepEqual(xrange(3, -1, -1).toArray().reverse(), zero2three);

                assert.deepEqual(xrange(1, 4,  1).toArray(),
                    zero2three.slice(1));
                assert.deepEqual(xrange(3, 0, -1).toArray().reverse(),
                    zero2three.slice(1));

                assert.deepEqual(xrange(2, 4, 1).toArray(),
                    zero2three.slice(2));
                assert.deepEqual(xrange(3, 1, -1).toArray().reverse(),
                    zero2three.slice(2));

                assert.deepEqual(xrange(3, 4, 1).toArray(),
                    zero2three.slice(3));
                assert.deepEqual(xrange(3, 2, -1).toArray().reverse(),
                    zero2three.slice(3));

                assert.deepEqual(xrange(0, 4, 2).toArray(), [0, 2]);
                assert.deepEqual(xrange(2, -1, -2).toArray().reverse(), [0,
                    2]);

                assert.deepEqual(xrange(1, 4, 2).toArray(), [1, 3]);
                assert.deepEqual(xrange(3, 0, -2).toArray().reverse(), [1, 3]);

                assert.deepEqual(xrange(2, 4, 2).toArray(), [2]);
                assert.deepEqual(xrange(2, 0, -2).toArray(), [2]);

                assert.deepEqual(xrange(3, 4, 2).toArray(), [3]);
                assert.deepEqual(xrange(3, 2, -2).toArray(), [3]);

                assert.deepEqual(xrange(0, 4, 3).toArray(), [0, 3]);
                assert.deepEqual(xrange(3, -1, -3).toArray().reverse(), [0,
                        3]);

                assert.deepEqual(xrange(1, 4, 3).toArray(), [1]);
                assert.deepEqual(xrange(1, -2, -3).toArray(), [1]);

                assert.deepEqual(xrange(2, 4, 3).toArray(), [2]);
                assert.deepEqual(xrange(3, 4, 3).toArray(), [3]);

                assert.deepEqual(xrange(0, 4, 4).toArray(), [0]);
            });
        });
    });

    describe('iterators', function () {
        [ 'each', 'forEach' ].forEach(function (key) {
            it(key, function () {
                var results = [];
                xrange(4)[key](function (each) {
                    results.push(each);
                });

                assert.deepEqual(results, zero2three);
            });

            it(key + ' backward', function () {
                var results = [];
                xrange(-4)[key](function (each) {
                    results.push(each);
                });

                assert.deepEqual(results, zero2MinusThree);
            });

            it(key + ' with index and xrange', function () {
                var indices = [];
                var unitUnderTest = xrange(5, 9);
                unitUnderTest[key](function (each, idx, r) {
                    indices.push(idx);
                    assert.strictEqual(r, unitUnderTest);
                });
                assert.deepEqual(indices, zero2three);
            });
        });

        it('map', function () {
            assert.deepEqual(xrange(-1, 3).map(function (each) {
                return each + 1;
            }), zero2three);
        });

        it('map backward', function () {
            assert.deepEqual(xrange(-1, -5).map(function (each) {
                return each + 1;
            }), zero2MinusThree);
        });

        it('map with index and xrange', function () {
            var indices = [];
            var unitUnderTest = xrange(5, 9);
            unitUnderTest.map(function (each, idx, r) {
                indices.push(idx);
                assert.strictEqual(r, unitUnderTest);
            });
            assert.deepEqual(indices, zero2three);
        });


        [ ['iterator', 'iterator'], ['Symbol.iterator', Symbol.iterator] ].forEach(function (test) {
            var key = test[0];
            var prop = test[1];
            it(key, function () {
                var iterator = xrange(4)[prop]();
                var results = [];
                while (true) {
                    var next = iterator.next();
                    if (next.done) {
                        break;
                    }
                    results.push(next.value);
                }
                assert.deepEqual(results, zero2three);
            });
        });

        describe('every', function () {
            it('returns true if every test passes', function () {
                assert.ok(xrange(5).every(function (value) {
                    return value < 5;
                }));
            });

            it('returns false if any test fails', function () {
                assert.ok(!xrange(5).every(function (value) {
                    return value !== 3;
                }));
            });

            it('returns true for an empty range', function () {
                assert.ok(xrange(0).every(function () {
                    return false;
                }));
            });
        });
    });
});

