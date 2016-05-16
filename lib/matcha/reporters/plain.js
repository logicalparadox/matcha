/*!
 * Matcha - Plain Reporter
 * Copyright(c) 2013 Lauris Vavere <lauris@ma-1.lv>
 * MIT Licensed
 */

/*!
 * Internal Dependancies
 */


function pad(str, width) {
  str = str.substr(0,width-3);
  return str + ' ' + Array(width - str.length-2).join('.') + ' ';
};

// process.stdout.write shim for browserify
if (typeof process.stdout === 'undefined') {
  process.stdout = {
    write: console.log.bind(console)
  }
}

/**
 * Plain
 *
 * The plain text matcha reporter.
 *
 * @param {Runner} runner
 * @api public
 */

module.exports = function(runner, utils) {
  var humanize = utils.humanize;

  runner.on('start', function () {
    // console.log();
  });

  runner.on('end', function (stats) {
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
};
