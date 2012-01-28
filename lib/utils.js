
var exports = module.exports = {};

exports.defaults = function (a, b) {
  if (a && b) {
    for (var key in b) {
      if ('undefined' == typeof a[key])
        a[key] = b[key];
    }
  }
  return a;
};

exports.series = function (arr, delay, iterator, done) {
  if ('function' == typeof delay) {
    done = iterator;
    iterator = delay;
    delay = 0;
  }
  var len = arr.length
    , i = 0;
  done = done || function () {};
  function iterate () {
    function cb() {
      if (++i == len) return done();
      var obj = arr[i];
      if (delay > 0) {
        setTimeout(function () {
          iterate();
        }, delay);
      } else {
        iterate();
      }
    };
    iterator(arr[i], i, cb);
  };
  iterate();
};
