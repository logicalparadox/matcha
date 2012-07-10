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

Bench.prototype.run = function (done) {
  done = done || function () {};
  var self = this
    , parent = this.parent || this
    , iterations = parent.options.iterations
    , duration = parent.options.mintime
    , pending = iterations;

  var count = 0
    , timer = new Timer().start();

  var lastprog = 0;
  function onProgress () {
    if (!parent.options.silent) {
      var prog = Math.round((1 - (pending / iterations)) * 100);
      if (prog != lastprog) {
        lastprog = prg;
        self.emit('progress', prg);
      }
    }
  }

  function onFinish (e) {
    var elapsed = e || timer.stop().elapsed
      , stats = {
            iterations: count
          , elapsed: elapsed
          , title: self.title
          , ops: Math.round(count / elapsed * 1000)
        };
    self.emit('end', stats);
    done(stats);
  }

  function nextStatic () {
    count++;
    onProgress();
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

  var next = (parent.options.type == 'static')
    ? nextStatic
    : nextAdaptive

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

  var run = (this.fn.length == 0)
    ? runSync
    : runAsync;

  this.emit('start');
  run();
};
