/*!
 * Matcha - Clean Reporter
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Internal Dependancies
 */

var Base = require('./base');

/*!
 * Shortcuts
 */

var color = Base.color
  , padBefore = Base.padBefore
  , cursor = Base.cursor
  , humanize = Base.humanize;

/*!
 * Primary Export
 */

module.exports = Clean;

/**
 * Clean
 *
 * The original matcha reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Clean (runner) {
  Base.call(this, runner);
  var stats = this.stats;

  runner.on('start', function () {
    console.log();
  });

  runner.on('end', function () {
    console.log();
    console.log(color('  Suites:  ', 'gray') + stats.suites);
    console.log(color('  Benches: ', 'gray') + stats.benches);
    console.log(color('  Elapsed: ', 'gray') + humanize(stats.elapsed.toFixed(2)) + ' ms');
    console.log();
  });

  runner.on('suite start', function (suite) {
    console.log(padBefore('', 23) + suite.title);
  });

  runner.on('suite end', function (suite) {
    console.log();
  });

  runner.on('bench start', function (bench) {
    process.stdout.write('\r' + color(padBefore('wait ⨠ ', 25), 'yellow')
                              + color(bench.title, 'gray'));
  });

  runner.on('bench end', function (results) {
    cursor.CR();
    var ops = humanize(results.ops.toFixed(0));
    console.log(color(padBefore(ops + ' op/s', 22), 'blue')
              + color(' ⨠ ' + results.title, 'gray'));
  });
}

/*!
 * Inherits from `Base.prototype` reporter
 */

Clean.prototype.__proto__ = Base.prototype;
