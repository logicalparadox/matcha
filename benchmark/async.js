
suite('async', function () {
  set('mintime', 2000);

  bench('nextTick', function (done) {
    process.nextTick(done);
  });

  bench('setTimeout 1', function (done) {
    setTimeout(done, 1);
  });

});
