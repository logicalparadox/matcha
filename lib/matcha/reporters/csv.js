/*!
 * Matcha - CSV Reporter
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

module.exports = Csv;

/**
 * Plain
 *
 * The csv matcha reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Csv (runner) {
  Base.call(this, runner);
  var curDate = toCsvDate(new Date());
  var curSuite = null;
  var curBench = null;

  runner.on('suite start', function (suite) {
    curSuite = suite.title;
  });

  runner.on('bench start', function (bench) {
    curBench = bench.title;
  });

  runner.on('bench end', function (results) {
    console.log(curDate + ',"' +
      curSuite + '","' +
      curBench + '",' +
      results.elapsed.toFixed(6) + "," +
      results.iterations
    );
  });
}

function pad (n) {
  return n < 10 ? '0' + n : n;
}

function toCsvDate (d) {
  return d.getFullYear() + '-' +
    pad(d.getMonth() + 1) + '-' +
    pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' +
    pad(d.getMinutes()) + ':' +
    pad(d.getSeconds());
}

/*!
 * Inherits from Base reporter
 */

util.inherits(Csv, Base);
