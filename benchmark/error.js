
/*
suite('errors', function () {
  before(function () {
    throw new Error('before sync');
  })
  before(function (next) {
    next(new Error('before async'));
  });
  bench('sync', function () {
    throw new Error('sync');
  });
  bench('async', function () {
    cb(new Error('async'));
  });
  after(function () {
    throw new Error('after sync');
  })
  after(function (next) {
    next(new Error('after async'));
  });
});
*/
