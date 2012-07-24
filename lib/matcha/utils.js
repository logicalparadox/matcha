
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

  done = done || function () {};

  function iterate (i) {
    var fn = arr[i];
    if (!fn) return done();
    iterator(fn, function cb() {
      if (!delay) return iterate(++i);
      setTimeout(function () {
        iterate(++i);
      }, delay);
    });
  };

  iterate(0);
};
