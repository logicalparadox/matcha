var colors = require('colors');

module.exports = Reporter;

function Reporter (suite) {
  var self = this;
  
  this.suite = suite;
  
  suite.on('start', function () {
    self.suiteStart.apply(self, arguments);
  });
  
  //suite.on('progress');
  
  suite.on('bench start', function () {
    self.benchStart.apply(self, arguments);
  });
  
  suite.on('bench end', function () {
    self.benchEnd.apply(self, arguments);
  });
  
  suite.on('end', function () {
    self.suiteEnd.apply(self, arguments);
  });
}

Reporter.prototype.suiteStart = function () {
  console.log('');
  console.log('  %s'.green, pad('Suite Started', 15));
  console.log('');
};

Reporter.prototype.benchStart = function (name, options) {
  console.log('  %s '.grey + name.blue, pad('bench:', 15));
};

Reporter.prototype.benchEnd = function (name, results) {
  var w = 15;
  
  var memory = ((results.memory.end.heapUsed - results.memory.start.heapUsed) / 1048576).toFixed(3) + ' MB'
    , ops = (results.iterations / results.elapsed * 100).toFixed(0)
    , elpsd = (( results.elapsed / 1000) % 60 );
  
  console.log('  %s '.grey + humanize(ops), pad('op/s:', w));
  console.log('  %s '.grey + memory, pad('mem:', w));
  console.log('  %s '.grey + elpsd + ' seconds', pad('elapse:', w));
  console.log('');
};

Reporter.prototype.suiteEnd = function (results) {
  var w = 15;
  
  console.log('  %s'.green, pad('Suite Summary', w));
  console.log('');
  
  var memory = ((results.memory.end.heapUsed - results.memory.start.heapUsed) / 1048576).toFixed(3) + ' MB'
    , elpsd = (( results.elapsed / 1000) % 60 );

  console.log('  %s '.grey + results.tests, pad('bench(s):', w));
  console.log('  %s '.grey + memory, pad('mem:', w));
  console.log('  %s '.grey + elpsd + ' seconds', pad('elapse:', w));
  console.log('');
};


// from @visionmedia/vbench

function pad(str, width) {
  return Array(width - str.length).join(' ') + str;
}

function humanize(n) {
  var n = String(n).split('.')
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  return n.join('.')
}