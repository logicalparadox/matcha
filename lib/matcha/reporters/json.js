/*!
 * Matcha - JSON Reporter
 * Copyright(c) 2016 Anna Henningsen <sqrt@entless.org>
 * MIT Licensed
 */

module.exports = function(runner, utils) {
  var curSuite = null;
  var curBench = null;
  var runs = [];
  var isFirstRun = true;
  
  runner.on('start', function () {
    console.log('{"runs":[');
  });
  
  runner.on('end', function (stats) {
    console.log('],\n"stats":' + JSON.stringify(stats) + '}');
  });

  runner.on('suite start', function (suite) {
    curSuite = suite.title;
  });

  runner.on('bench start', function (bench) {
    curBench = bench.title;
  });

  runner.on('bench end', function (results) {
    console.log((isFirstRun ? '' : ',') + JSON.stringify({
      suite: curSuite,
      bench: curBench,
      results: results
    }));
    
    isFirstRun = false;
  });
};
