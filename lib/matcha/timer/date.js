/*!
 * Matcha - Date-based timer for Node.js
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Export
 */

module.exports = Timer;

/**
 * Timer (constructor)
 *
 * Constructs a timer that will return a high accuracy
 * elapsed calculation.
 *
 * @api public
 */

function Timer () {
  this._start = null;
  this._elapsed = null;
}

/**
 * .elapsed
 *
 * Calculate the milliseconds elapsed time
 * for the given elapsed hrdiff.
 *
 * @returns Number ms elapsed since start
 */

Object.defineProperty(Timer.prototype, 'elapsed',
  { get: function () {
      return this._elapsed;
    }
});

/**
 * .start ()
 *
 * Mark the starting point for this timer.
 *
 * @api public
 */

Timer.prototype.start = function () {
  this._start = new Date().getTime();
  return this;
};

/**
 * .stop ()
 *
 * Mark the stopping point for this timer.
 * using hrtimes built in differ capability.
 *
 * @api public
 */

Timer.prototype.stop = function () {
  this._elapsed = new Date().getTime() - this._start;
  return this;
};
