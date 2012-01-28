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
    if (!self.parent.options.silent) {
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
      var elapsed = new Date() - start;
      self.done({
        iterations: iterations,
        elapsed: elapsed,
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
            iterations: iterations
          , count: self.count
          , elapsed: elapsed
        });
      }
    }
  }

  var next = this.parent.options.type == 'static'
    ? nextStatic
    : nextAdaptive
  self.emit('bench progress', lastprog);
  while (i--) {
    this.fn(next);
  }
};
