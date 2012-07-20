var EventEmitter = require('events').EventEmitter;

var Timer = require('./timer');

module.exports = Bench;

function Bench (title, fn) {
  this.title = title;
  this.fn = fn;
  this.options = {
      type: 'adaptive'
    , iterations: 100
    , mintime: 500
    , silent: true
    , delay: 100
  };
}

Bench.prototype.__proto__ = EventEmitter.prototype;

Bench.prototype.run = function (cb) {
  var self = this
    , parent = this.parent || this
    , iterations = parent.options.iterations
    , duration = parent.options.mintime
    , pending = iterations
    , count = 0
    , lastprog = 0
    , timer = new Timer().start();

  cb = cb || function () {};

  function onFinish (e) {
    var elapsed = e || timer.stop().elapsed
      , stats = {
            iterations: count
          , elapsed: elapsed
          , title: self.title
          , ops: Math.round(count / elapsed * 1000)
        };

    self.emit('end', stats);
    cb(stats);
  }

  function nextStatic () {
    count++;
    --pending || onFinish();
  };

  function nextAdaptive () {
    count++;
    if (!--pending) {
      var elapsed = timer.stop().elapsed;
      if (elapsed < duration) {
        var add = Math.round(count * (duration / (elapsed + 1)));
        pending = add;
        run();
      } else {
        onFinish(elapsed);
      }
    }
  }

  function runSync () {
    var i = pending;
    while (i--) {
      self.fn();
      next();
    }
  }

  function runAsync () {
    var i = pending;
    while (i--) {
      self.fn(next);
    }
  }

  var run = this.fn.length === 0
      ? runSync
      : runAsync
    , next = parent.options.type === 'static'
      ? nextStatic
      : nextAdaptive

  this.emit('start');
  run();
};
