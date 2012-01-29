
suite('function', function () {
  function foo () {}

  bench('foo()', function (next) {
    foo(1,2,3);
    next();
  });

  bench('foo.call', function (next) {
    foo.call(foo, 1, 2, 3);
    next();
  });

  bench('foo.apply', function (next) {
    foo.apply(foo, [ 1, 2, 3 ]);
    next();
  });
});
