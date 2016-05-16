/*!
 * Matcha - Markdown Reporter
 * Created by J. Harshbarger, based on
 * Matcha - Plain Reporter
 * Copyright(c) 2013 Lauris Vavere <lauris@ma-1.lv>
 * MIT Licensed
 */

/*!
 * Internal Dependancies
 */
 var platform = require('platform');


function pad(str, width) {
  str = str.substr(0,width-3);
  return str + ' ' + Array(width - str.length-2).join('.') + ' ';
};



/**
 * Plain
 *
 * The markdown text matcha reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function desc(a,b) {
  return b.stats.ops - a.stats.ops;
}

module.exports = function(runner, utils) {
  var humanize = utils.humanize;

  runner.on('start', function () {
    console.log('# ' + platform.description);
  });

  runner.on('end', function (stats) {
    console.log('');
    /* console.log('Suites:  ' + stats.suites);
    console.log('Benches: ' + stats.benches);
    console.log('Elapsed: ' + humanize(stats.elapsed.toFixed(2)) + ' ms'); */
  });

  runner.on('suite start', function (suite) {
    console.log('');
    console.log('## ' + suite.title);
    console.log('');
  });

  runner.on('suite end', function (suite) {
    if (suite.benches.length > 1) {
      var benches = suite.benches.slice().sort(desc);
      console.log('');
      console.log('*Fastest is **' + benches[0].title + '***');
    }
  });

  runner.on('bench start', function (bench) {
    // process.stdout.write('    ' + pad(bench.title, 50));
  });

  runner.on('bench end', function (results) {
    console.log('    ' + pad(results.title, 50) + humanize(results.ops.toFixed(0)) + ' op/s');
  });
};
