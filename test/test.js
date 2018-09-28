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
                var iterator = xrange(5, 10)[prop]();
                var results = [];
                while (true) {
                    var next = iterator.next();
                    if (next.done) {
                        break;
                    }
                    results.push(next.value);
                }
                assert.deepEqual(results, [5, 6, 7, 8, 9]);
            });
        });

        it('entries', function () {
            var iterator = xrange(4, 12, 2).entries();
            var entries = [];
            while (true) {
                var next = iterator.next();
                if (next.done) {
                    break;
                }
                entries.push(next.value);
            }
            assert.deepEqual(entries, [[0, 4], [1, 6], [2, 8], [3, 10]]);
        });

        it('keys', function () {
            var iterator = xrange(4, 12, 2).keys();
            var keys = [];
            while (true) {
                var next = iterator.next();
                if (next.done) {
                    break;
                }
                keys.push(next.value);
            }
            assert.deepEqual(keys, [0, 1, 2, 3]);
        });
    });

    it('reversed', function () {
        var reversed = xrange(2, 13, 3).reversed();
        assert.deepEqual(reversed.toArray(), [11, 8, 5, 2]);
        assert.strictEqual(reversed.length, 4);
    });

    it('reversed by 1', function () {
        var reversed = xrange(2, 6).reversed();
        assert.deepEqual(reversed.toArray(), [5, 4, 3, 2]);
        assert.strictEqual(reversed.length, 4);
    });

    it('reversed backward', function () {
        var reversed = xrange(13, 2, -3).reversed();
        assert.deepEqual(reversed.toArray(), [4, 7, 10, 13]);
        assert.strictEqual(reversed.length, 4);
    });

    it('reversed backward by 1', function () {
        var reversed = xrange(6, 2, -1).reversed();
        assert.deepEqual(reversed.toArray(), [3, 4, 5, 6]);
        assert.strictEqual(reversed.length, 4);
    });

    it('reversed empty', function () {
        var reversed = xrange(5, 5).reversed();
        assert.deepEqual(reversed.toArray(), []);
        assert.strictEqual(reversed.length, 0);
    });

    it('filter', function () {
        var filtered = xrange(5, 10).filter(function (value) {
            return value % 3 === 0;
        });
        assert.deepEqual(filtered, [6, 9]);
    });

    it('find', function () {
        var found = xrange(5, 10).find(function (value) {
            return value % 3 === 0;
        });
        assert.strictEqual(found, 6);
    });

    it('find nothing', function () {
        var found = xrange(5, 10).find(function (value) {
            return value < 5;
        });
        assert.strictEqual(found, undefined);
    });

    it('findIndex', function () {
        var found = xrange(5, 10).findIndex(function (value) {
            return value % 3 === 0;
        });
        assert.strictEqual(found, 1);
    });

    it('find no index', function () {
        var found = xrange(5, 10).findIndex(function (value) {
            return value < 5;
        });
        assert.strictEqual(found, -1);
    });

    it('findEntry', function () {
        var found = xrange(5, 10).findEntry(function (value) {
            return value % 3 === 0;
        });
        assert.deepEqual(found, [1, 6]);
    });

    it('find no entry', function () {
        var found = xrange(5, 10).findEntry(function (value) {
            return value < 5;
        });
        assert.deepEqual(found, [-1, undefined]);
    });

    it('includes', function () {
        assert.ok(xrange(4).includes(2));
    });

    it('does not include', function () {
        assert.ok(!xrange(4).includes(4));
    });

    describe('indexOf', function () {
        it('is found', function () {
            assert.strictEqual(xrange(5, 10).indexOf(7), 2);
        });

        it('is not found', function () {
            assert.strictEqual(xrange(5, 10).indexOf(10), -1);
        });
    });

    describe('join', function () {
        it('with a sep', function () {
            assert.strictEqual(xrange(5, 11).join(', '), '5, 6, 7, 8, 9, 10');
        });

        it('without a sep', function () {
            assert.strictEqual(xrange(5, 11).join(), '5678910');
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

    describe('some', function () {
        it('returns false if every test fails', function () {
            assert.ok(!xrange(5).some(function (value) {
                return value >= 5;
            }));
        });

        it('returns true if any test passes', function () {
            assert.ok(xrange(5).some(function (value) {
                return value === 3;
            }));
        });

        it('returns false for an empty range', function () {
            assert.ok(!xrange(0).some(function () {
                return true;
            }));
        });
    });

    it('reduce', function () {
        var sum = xrange(5, 10).reduce(function (acc, value) {
            return acc + value;
        }, 0);
        assert.strictEqual(sum, 35);
    });

    it('reduce without init', function () {
        var sum = xrange(5, 10).reduce(function (acc, value) {
            return acc * value;
        });
        assert.strictEqual(sum, 15120);
    });

    describe('shifted', function () {
        it('no-arg', function () {
            var shifted = xrange(5, 10).shifted();
            assert.deepEqual(shifted.toArray(), [6, 7, 8, 9]);
            assert.strictEqual(shifted.length, 4);
        });

        it('by amount', function () {
            var shifted = xrange(5, 10).shifted(3);
            assert.deepEqual(shifted.toArray(), [8, 9]);
            assert.strictEqual(shifted.length, 2);
        });

        it('by length', function () {
            var shifted = xrange(5, 10).shifted(5);
            assert.deepEqual(shifted.toArray(), []);
            assert.strictEqual(shifted.length, 0);
        });

        it('by more than length', function () {
            var shifted = xrange(5, 10).shifted(10);
            assert.deepEqual(shifted.toArray(), []);
            assert.strictEqual(shifted.length, 0);
        });

        it('by negative amount', function () {
            var shifted = xrange(5, 10).shifted(-2);
            assert.deepEqual(shifted.toArray(), [3, 4, 5, 6, 7, 8, 9]);
            assert.strictEqual(shifted.length, 7);
        });

        it('on backward range', function () {
            var shifted = xrange(3, -6, -2).shifted(2);
            assert.deepEqual(shifted.toArray(), [-1, -3, -5]);
            assert.strictEqual(shifted.length, 3);
        });
    });

    describe('extended', function () {
        it('no-arg', function () {
            var extended = xrange(5, 10).extended();
            assert.deepEqual(extended.toArray(), [5, 6, 7, 8, 9, 10]);
            assert.strictEqual(extended.length, 6);
        });

        it('by amount', function () {
            var extended = xrange(5, 10).extended(3);
            assert.deepEqual(extended.toArray(), [5, 6, 7, 8, 9, 10, 11, 12]);
            assert.strictEqual(extended.length, 8);
        });

        it('by negative length', function () {
            var extended = xrange(5, 10).extended(-5);
            assert.deepEqual(extended.toArray(), []);
            assert.strictEqual(extended.length, 0);
        });

        it('by less than negative length', function () {
            var extended = xrange(5, 10).extended(-10);
            assert.deepEqual(extended.toArray(), []);
            assert.strictEqual(extended.length, 0);
        });

        it('by negative amount', function () {
            var extended = xrange(5, 10).extended(-2);
            assert.deepEqual(extended.toArray(), [5, 6, 7]);
            assert.strictEqual(extended.length, 3);
        });

        it('on backward range', function () {
            var extended = xrange(3, -6, -2).extended(2);
            assert.deepEqual(extended.toArray(), [3, 1, -1, -3, -5, -7, -9]);
            assert.strictEqual(extended.length, 7);
        });
    });
});

