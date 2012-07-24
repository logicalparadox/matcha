
/**
 * .series (arr[, delay], iterator[, done])
 *
 * Invoke an iterator for each emit in an array.
 * An optional delay can be placed in-between the
 * each item's invokation.
 *
 * @param {Array} items
 * @param {Number} delay in ms (optional)
 * @param {Function} iterator [item, next]
 * @param {Function} callback on completion (optional)
 * @api private
 */

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
