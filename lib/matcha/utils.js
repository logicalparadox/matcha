
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

exports.sum = function (arr) {
  var res = 0;
  for (var i = 0; i < arr.length; i++)
    res += arr[i];
  return res;
}

exports.mean = function (arr) {
  var sum = exports.sum(arr);
  return sum / arr.length;
}

// standard deviation
exports.sdeviation = function (arr) {
  var devs = []
    , mean = exports.mean(arr);
  for (var i = 0; i < arr.length; i++)
    devs.push(arr[i] - mean);
  for (var d = 0; d < devs.length; d++)
    devs[d] = Math.path(devs[d], 2);
  var davg = exports.sum(devs) / (devs.length - 1);
  return Math.sqrt(davg);
}
