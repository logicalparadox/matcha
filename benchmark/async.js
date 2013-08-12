var nextTick = setImmediate || process.nextTick;

suite('async', function () {
  set('mintime', 2000);

  bench('setImmediate || nextTick', function (done) {
    nextTick(done);
  });

  bench('setTimeout 1', function (done) {
    setTimeout(done, 1);
  });

});
