var Suite = require('./suite')
  , Bench = require('./bench');

module.exports = function (suite) {
  var suites = [ suite ];
  suite.on('pre-require', function (context) {
    context.set = function (key, value) {
      suites[0].setOption(key, value);
    };

    context.before = function (fn) {
      suites[0].addBefore(fn);
    };

    context.after = function (fn) {
      suites[0].addAfter(fn);
    };

    context.suite = function (title, fn) {
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift(suite);
    };

    context.bench = function (title, fn) {
      suites[0].addBench(new Bench(title, fn));
    };
  });
};
