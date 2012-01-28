var EventEmitter = require('events').EventEmitter;

module.exports = Bench;

function Bench (title, fn) {
  this.title = title;
  this.fn = fn;
  this.options = {};
}

Bench.prototype.__proto__ = EventEmitter.prototype;

Bench.prototype.run = function (done, iters) {
  done = done || function () {};
  var self = this
    , iterations = iters || this.parent.options.iterations
    , duration = this.parent.options.duration || 3000
    , i = iterations
    , pending = i
    , lastprog = 0

  this.count = this.count || 0;
  this.start = this.start || new Date();
  this.done = this.done
    || done
    || function () {};

  function progress () {
    self.count++;
    if (!self.parent.options.silent && self.parent.options.type == 'static') {
      var prg = Math.round((1 - (pending / iterations)) * 100);
      if (prg != lastprog) {
        lastprog = prg;
        self.emit('bench progress', prg);
      }
    }
  }

  function nextStatic () {
    progress();
    if (!--pending) {
      var elapsed = new Date() - self.start;
      self.done({
          iterations: self.count
        , elapsed: elapsed
        , title: self.title
        , ops: Math.round(self.count / elapsed * 1000)
      });
    }
  };

  function nextAdaptive () {
    progress();
    if (!--pending) {
      var elapsed = new Date() - self.start;
      if (elapsed < duration) {
        var add = Math.round(iterations * 0.6);
        self.run(null, iterations + add);
      } else {
        self.done({
            iterations: self.count
          , elapsed: elapsed
          , title: self.title
          , ops: Math.round(self.count / elapsed * 1000)
        });
      }
    }
  }

  var next = this.parent.options.type == 'static'
    ? nextStatic
    : nextAdaptive

  if (this.fn.length == 0) {
    while (i--) {
      this.fn();
      next();
    }
  } else {
    while (i--) this.fn(next);
  }
};
