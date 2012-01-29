var exports = module.exports = Reporter;

var color = exports.color = function (str, color) {
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

exports.highlight = function (str, color) {
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

function humanize(n) {
  var n = String(n).split('.')
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  return n.join('.')
}

// from mocha
exports.cursor = {
  hide: function(){
    process.stdout.write('\033[?25l');
  },

  show: function(){
    process.stdout.write('\033[?25h');
  },

  deleteLine: function(){
    process.stdout.write('\033[2K');
  },

  beginningOfLine: function(){
    process.stdout.write('\033[0G');
  },

  CR: function(){
    exports.cursor.deleteLine();
    exports.cursor.beginningOfLine();
  }
};

exports.padAfter = function (str, width) {
  return str + Array(width - str.length).join(' ');
};

exports.padBefore = function (str, width) {
  return Array(width - str.length).join(' ') + str;
};

function Reporter (runner) {
  var self = this
    , start = new Date()
    , bn = 0
    , sn = 0
    , level = 1;

  this.runner = runner;

  runner.on('start', function () {
    console.log();
  });

  runner.on('end', function () {
    var elapsed = new Date() - start;
    console.log();
    console.log(color('  Suites:  ', 'gray') + sn);
    console.log(color('  Benches: ', 'gray') + bn);
    console.log(color('  Elapsed: ', 'gray') + elapsed + ' ms');
    console.log();
  });

  runner.on('suite start', function (title) {
    ++level;
    console.log(exports.padBefore('', 23) + title);
  });

  runner.on('suite end', function (title) {
    sn++;
    --level;
  });

  runner.on('bench start', function (title) {
    process.stdout.write('\r' + exports.color(exports.padBefore('wait ⨠ ', 25), 'yellow')
                              + exports.color(title, 'gray'));
  });

  runner.on('bench list', function (res) {
    res.sort(function (a, b) { return b.ops - a.ops });
    var l = res.length
      , winner = res[0]
      , loser = res[l - 1];
    console.log();
  });

  runner.on('bench progress', function (perc) {
    // perhaps later ?
  });

  runner.on('bench end', function (results) {
    bn++;
    exports.cursor.CR();
    var ops = humanize(results.ops.toFixed(0));
    console.log(exports.color(exports.padBefore(ops + ' op/s', 22), 'blue')
              + exports.color(' ⨠ ' + results.title, 'gray'));
  });
}

