
suite('loop', function () {
  var arr = [ 1, 2, 3, 4, 5, 6 ];

  bench('array loop: forEach', function (next) {
    var s = 0;
    arr.forEach(function (n) {
      s = s + n;
    });
    next();
  });

  bench('array loop: for in', function (next) {
    var s = 0;
    for (var i in arr) {
      s = s + arr[i];
    }
    next();
  });

  bench('array loop: for count', function (next) {
    var s = 0;
    for (var i = 1; i < arr.length; i++) {
      s = s + arr[i];
    }
    next();
  });

  suite('loop', function () {
    set('type', 'static')
    set('iterations', 1000000);

    var arr = [ 1, 2, 3, 4, 5, 6 ];

    bench('array loop: forEach', function (next) {
      var s = 0;
      arr.forEach(function (n) {
        s = s + n;
      });
      next();
    });

    bench('array loop: for in', function (next) {
      var s = 0;
      for (var i in arr) {
        s = s + arr[i];
      }
      next();
    });

    bench('array loop: for count', function (next) {
      var s = 0;
      for (var i = 1; i < arr.length; i++) {
        s = s + arr[i];
      }
      next();
    });
  });
});
