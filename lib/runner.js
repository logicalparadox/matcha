var EventEmitter = require('events').EventEmitter
  , _ = require('./utils');

module.exports = Runner;

function Runner (suite) {
  this.suite = suite;
}

function proxy(from, to, ev) {
  from.on(ev, function () {
    var args = Array.prototype.slice.call(arguments)
      , event = [ ev ].concat(args);
    to.emit.apply(to, event);
  });
};

Runner.prototype.__proto__ = EventEmitter.prototype;

Runner.prototype.run = function (cb) {
  var self = this;
  this.emit('start');
  this.runBenches(function () {
    self.runSuites(function () {
      cb();
    });
  });
};

Runner.prototype.runBenches = function(cb) {
  var self = this
    , suite = this.suite
    , stats = []
    , delay = suite.options.delay;
  if (suite.benches.length == 0) return cb();
  _.series(suite.benches, delay, function (bench, index, fn) {
    proxy(bench, self, 'bench progress');
    self.emit('bench start', bench.title);
    bench.run(function (res) {
      stats.push(res);
      self.emit('bench end', res);
      fn();
    });
  }, function () {
    self.emit('bench list', stats);
    cb();
  });
};

Runner.prototype.runSuites = function (cb) {
  var self = this
    , suite = this.suite
    , delay = suite.options.delay;
  if (suite.suites.length == 0) return cb();
  _.series(suite.suites, delay, function (suite, index, fn) {
    var runner = new Runner(suite);
    proxy(runner, self, 'suite start');
    proxy(runner, self, 'suite end');
    proxy(runner, self, 'bench start');
    proxy(runner, self, 'bench progress');
    proxy(runner, self, 'bench end');
    proxy(runner, self, 'bench list');
    self.emit('suite start', suite.title);
    runner.run(function () {
      self.emit('suite end', suite.title);
      fn();
    });
  }, function () {
    cb()
  });
};
