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

Bench.prototype.run = function (done, iters) {
  var self = this
    , parent = this.parent || this
    , iterations = iters || parent.options.iterations
    , duration = parent.options.duration
    , i = iterations
    , pending = i
    , lastprog = 0

  this.store = [];
  this.count = this.count || 0;
  this.start = this.start || new Date();
  this.done = this.done || done || function () {};

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
    var elapsed = e || new Date() - self.start
      , stats = {
            iterations: self.count
          , elapsed: elapsed
          , title: self.title
          , ops: Math.round(self.count / elapsed * 1000)
        };
    self.emit('end', stats);
    self.done(stats);
  }

  function nextStatic () {
    self.count++;
    onProgress();
    --pending || onFinish();
  };

  function nextAdaptive () {
    self.count++;
    if (!--pending) {
      var elapsed = new Date() - self.start;
      if (elapsed < duration) {
        var add = Math.round(iterations * 0.6);
        self.run(null, iterations + add);
      } else {
        onFinish(elapsed);
      }
    }
  }

  var next = (parent.options.type == 'static')
    ? nextStatic
    : nextAdaptive

  this.emit('start');
  if (this.fn.length == 0) {
    while (i--) {
      this.fn();
      next();
    }
  } else {
    while (i--) this.fn(next);
  }
};
