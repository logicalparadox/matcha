
function foo () {}

bench('()', function (next) {
  foo(1,2,3);
  next();
});

bench('.call', function (next) {
  foo.call(foo, 1, 2, 3);
  next();
});

bench('.apply', function (next) {
  foo.apply(foo, [ 1, 2, 3 ]);
  next();
});