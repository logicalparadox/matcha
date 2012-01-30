var EventEmitter = require('events').EventEmitter;

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
    , pending = iterations
    , duration = parent.options.mintime;

  var count = 0
    , start = new Date();

  var lastprog = 0;
  function onProgress () {
    if (!self.parent.options.silent) {
      var prog = Math.round((1 - (pending / iterations)) * 100);
      if (prog != lastprog) {
        lastprog = prg;
        self.emit('progress', prg);
      }
    }
  }

  function onFinish (e) {
    var elapsed = e || new Date() - start
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
    if (!--pending) return onFinish();
  };

  function nextAdaptive () {
    count++;
    if (!--pending) {
      var elapsed = new Date() - start;
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
