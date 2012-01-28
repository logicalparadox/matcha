module.exports = Reporter;

function Reporter (runner) {
  var self = this;

  this.runner = runner;

  runner.on('suite start', function (title) {
    console.log('suite start: ' + title);
  });

  runner.on('suite end', function (title) {
    console.log('suite end: ' + title);
  });

  runner.on('bench start', function (title) {
    console.log('bench start: ' + title);
  });

  runner.on('bench progress', function (perc) {
    process.stdout.write('\r' + perc);
  });

  runner.on('bench end', function (stats) {
    console.log(stats);
  });
}

