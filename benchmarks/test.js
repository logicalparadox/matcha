var matcha = require('..')
  , suite = new matcha.Suite({
    duration: 3000
  });

suite.bench('basic 1', function (next) {
  var arr = [];
  arr.push({ hello: 'world' });
  next();
});

module.exports = suite;