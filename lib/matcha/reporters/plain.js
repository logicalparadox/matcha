/*!
 * Matcha - Plain Reporter
 * Copyright(c) 2013 Lauris Vavere <lauris@ma-1.lv>
 * MIT Licensed
 */

/*!
 * Internal Dependancies
 */

var util = require('util');
var Base = require('./base');

/*!
 * Primary Export
 */

module.exports = Plain;

/*!
 * Shortcuts
 */

var humanize = Base.humanize;

/**
 * Plain
 *
 * The plain text matcha reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Plain (runner) {
  Base.call(this, runner);
  var stats = this.stats;

  runner.on('start', function () {
    // console.log();
  });

  runner.on('end', function () {
    console.log('Suites:  ' + stats.suites);
    console.log('Benches: ' + stats.benches);
    console.log('Elapsed: ' + humanize(stats.elapsed.toFixed(2)) + ' ms');
  });

  runner.on('suite start', function (suite) {
    console.log(suite.title);
  });

  runner.on('suite end', function (suite) {
    console.log();
  });

  runner.on('bench start', function (bench) {
    process.stdout.write('  ' + pad(bench.title, 50));
  });

  runner.on('bench end', function (results) {
    console.log(humanize(results.ops.toFixed(0)) + ' op/s');
  });
}

function pad(str, width) {
  str = str.substr(0,width-3);
  return str + ' ' + Array(width - str.length-2).join('.') + ' ';
};

/*!
 * Inherits from Base reporter
 */

util.inherits(Plain, Base);
