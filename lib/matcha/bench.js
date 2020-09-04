/*!
 * Matcha - Benchmark Constructor
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * External Dependancies
 */

var EventEmitter = require('events').EventEmitter
  , util = require('util');

/*!
 * Internal Dependancies
 */

var Timer = require('./timer');

/*!
 * Primary Exports
 */

module.exports = Bench;

function Bench (title, fn) {
  EventEmitter.call(this);
  this.title = title;
  this.fn = fn;
}

/*!
 * Inherits from `EventEmitter`
 */

util.inherits(Bench, EventEmitter);

/**
 * .run (cb)
 *
 * Run a bench.
 *
 * @param {Function} callback
 */

Bench.prototype.run = function (cb) {
  var self = this
    , opts = this.parent.options
    , runner = opts.type === 'static'
      ? runStatic
      : runAdaptive

  cb = cb || function () {};

  function report (total, elapsed) {
    var stats = {
        iterations: total
      , elapsed: elapsed
      , title: self.title
      , ops: Math.round(total / elapsed * 1000)
    };
    self.stats = stats;
    self.emit('end', stats);
    cb(stats);
  }

  runner.call(this, report);
};

/*!
 * runStatic (timer, cb)
 *
 * Run this bench as  static (set iterations).
 *
 * @param {Function} callback
 * @api private
 */

function runStatic (cb) {
  var self = this
    , parent = this.parent
    , iterations = parent.options.iterations
    , concurrency = parent.options.concurrency
    , pending = iterations
    , timer = new Timer()
    , total = 0;

  var runner = this.fn.length === 0
    ? doSync
    : doAsync;

  function next (total) {
    cb(total, timer.stop().elapsed);
  }

  this.emit('start');
  timer.start();
  runner(this.fn, pending, concurrency, next);
}

/*!
 * runStatic (timer, cb)
 *
 * Run this bench as adaptive: minimum
 * iterations then scale up to meet minimum
 * time frame.
 *
 * @param {Function} callback
 * @api private
 */

function runAdaptive (cb) {
  var self = this
    , parent = this.parent
    , duration = parent.options.mintime
    , iterations = parent.options.iterations
    , concurrency = parent.options.concurrency
    , pending = iterations
    , timer = new Timer()
    , total = 0;

  var runner = this.fn.length === 0
    ? doSync
    : doAsync

  function next (count) {
    total += count;
    if (timer.stop().elapsed < duration) {
      var pending = Math.round(count * (duration / (timer.elapsed + 1)));
      runner(self.fn, pending, concurrency, next);
    } else {
      cb(total, timer.elapsed);
    }
  }

  this.emit('start');
  timer.start();
  runner(this.fn, pending, concurrency, next);
}

/*!
 * doSync (fn, iterations, next)
 *
 * Run a syncronous bench function
 * a set number of iterations.
 *
 * @param {Function} bench function
 * @param {Number} iterations
 * @param {Function} callback when done
 * @api private
 */

function doSync (fn, iterations, concurrency, next) {
  var i = iterations;
  while (i--) { fn(); }
  next(iterations);
}

/*!
 * doAsync (fn, iterations, next)
 *
 * Run an asynchronous bench function
 * a set number of iterations.
 *
 * @param {Function} bench function
 * @param {Number} iterations
 * @param {Function} callback when done
 * @api private
 */

function doAsync (fn, iterations, concurrency, next) {
  var running = pending = iterations;

  function iterate () {
    if (!pending) return next(iterations)
    if (!running) return;
    --running;
    fn(function () {
      --pending;
      iterate();
    });
  }

  for (var i = 0; i < concurrency; ++i) {
    iterate();
  }
}
