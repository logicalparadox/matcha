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
  var self = this

  function iterator (fn, next) {
    fn(next);
  }

  function done () {
    self.emit('end');
    cb()
  }

  this.emit('start');

  _.series([
      this.runBefore.bind(this)
    , this.runBenches.bind(this)
    , this.runSuites.bind(this)
    , this.runAfter.bind(this)
  ], iterator, done);
};

Runner.prototype.runBenches = function (cb) {
  var self = this
    , suite = this.suite
    , stats = []
    , delay = suite.options.delay;

  if (suite.benches.length == 0) {
    return cb();
  }

  _.series(suite.benches, delay, function (bench, next) {
    self.emit('bench start', bench);
    bench.run(function (res) {
      stats.push(res);
      self.emit('bench end', res);
      next();
    });
  }, function () {
    self.emit('suite results', stats);
    cb();
  });
};

Runner.prototype.runSuites = function (done) {
  var self = this
    , suite = this.suite
    , delay = suite.options.delay;

  if (suite.suites.length == 0) {
    return done();
  }

  _.series(suite.suites, delay, function (suite, next) {
    var runner = new Runner(suite);
    proxy(runner, self, 'suite start');
    proxy(runner, self, 'suite end');
    proxy(runner, self, 'suite results');
    proxy(runner, self, 'bench start');
    proxy(runner, self, 'bench end');
    self.emit('suite start', suite);
    runner.run(function () {
      self.emit('suite end', suite);
      next();
    });
  }, done);
};

Runner.prototype.runBefore = function (done) {
  var self = this
    , suite = this.suite;

  if (suite.before.length == 0) {
    return done();
  }

  _.series(suite.before, function (fn, next) {
    if (fn.length == 0) {
      fn();
      next();
    } else {
      fn(next);
    }
  }, done);
};

Runner.prototype.runAfter = function (done) {
  var self = this
    , suite = this.suite;

  if (suite.after.length == 0) {
    return done();
  }

  _.series(suite.after, function (fn, next) {
    if (fn.length == 0) {
      fn();
      next();
    } else {
      fn(next);
    }
  }, done);
};
