

module.exports = function (suite) {
  suite.on('pre-require', function (context) {
    context.bench = function (title, fn) {
      suite.bench.call(suite, title, fn);
    };
  });
};