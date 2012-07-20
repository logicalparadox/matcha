/*!
 * Matcha - Base Reporter
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Internal Dependancies
 */

var Timer = require('../timer');

/*!
 * Primary Export
 */

module.exports = Base;

/**
 * Base
 *
 * Base reporter provides a framework for all
 * other reporters by aggregrating stats and
 * providing cli helpers.
 *
 * @param {Runner} runner
 * @api public
 */

function Base (runner) {
  var self = this
    , stats = this.stats = { suites: 0, benches: 0 }
    , timer;

  this.runner = runner;

  runner.on('start', function () {
    timer = new Timer().start();
  });

  runner.on('end', function () {
    stats.elapsed = timer.stop().elapsed;
  });

  runner.on('suite start', function (suite) {
    // ...
  });

  runner.on('suite end', function (suite) {
    stats.suites++;
  });

  runner.on('suite results', function (res) {
    // ...
  });

  runner.on('bench start', function (title) {
    // ...
  });

  runner.on('bench end', function (results) {
    stats.benches++;
  });
}

Base.color = function (str, color) {
  var options = {
      red:      '\u001b[31m'
    , green:    '\u001b[32m'
    , yellow:   '\u001b[33m'
    , blue:     '\u001b[34m'
    , magenta:  '\u001b[35m'
    , cyan:     '\u001b[36m'
    , gray:     '\u001b[90m'
    , reset:    '\u001b[0m'
  };
  return options[color] + str + options.reset;
};

Base.highlight = function (str, color) {
  var options = {
      red:      '\u001b[41m'
    , green:    '\u001b[42m'
    , yellow:   '\u001b[43m'
    , blue:     '\u001b[44m'
    , magenta:  '\u001b[45m'
    , cyan:     '\u001b[46m'
    , gray:     '\u001b[100m'
    , reset:    '\u001b[0m'
  };
  return options[color] + str + options.reset;
};

Base.padAfter = function (str, width) {
  return str + Array(width - str.length).join(' ');
};

Base.padBefore = function (str, width) {
  return Array(width - str.length).join(' ') + str;
};

Base.humanize = function (n) {
  var n = String(n).split('.')
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  return n.join('.')
};

// from mocha
Base.cursor = {
    hide: function () {
      process.stdout.write('\033[?25l');
    }

  , show: function () {
      process.stdout.write('\033[?25h');
    }

  , deleteLine: function () {
      process.stdout.write('\033[2K');
    }

  , beginningOfLine: function () {
      process.stdout.write('\033[0G');
    }

  , CR: function () {
      Base.cursor.deleteLine();
      Base.cursor.beginningOfLine();
    }
};
