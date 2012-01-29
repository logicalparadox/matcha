
suite('array loop', function () {
  var arr = [ 1, 2, 3, 4, 5, 6 ];

  bench('foo.forEach', function (next) {
    var s = 0;
    arr.forEach(function (n) {
      s = s + n;
    });
    next();
  });

  bench('for i in foo', function (next) {
    var s = 0;
    for (var i in arr) {
      s = s + arr[i];
    }
    next();
  });

  bench('for count', function (next) {
    var s = 0;
    for (var i = 1; i < arr.length; i++) {
      s = s + arr[i];
    }
    next();
  });

});
