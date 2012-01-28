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

function Reporter (runner) {
  var self = this
    , level = 1;

  this.runner = runner;

  function indent() {
    return Array(level).join('  ');
  }

  runner.on('start', function () {
    exports.cursor.hide();
    console.log();
  });

  runner.on('suite start', function (title) {
    ++level;
    console.log('%s%s', indent(), title);
  });

  runner.on('suite end', function (title) {
    --level;
  });

  runner.on('bench start', function (title) {
    console.log(color('%s  %s', 'blue'), indent(), title);
    process.stdout.write('\r' + indent() + color('  [running]', 'yellow'));
  });

  runner.on('bench list', function (res) {
    res.sort(function (a, b) { return b.ops - a.ops });
    var l = res.length
      , winner = res[0]
      , loser = res[l - 1];

    console.log(indent() + '  '
                + color('--------', 'gray'));
    console.log(indent() + '  '
                + color('[winner] ','green')
                + winner.title);
    console.log(indent() + '  '
                + color('[loser]  ', 'red')
                + loser.title);
    console.log();
  });
  runner.on('bench progress', function (perc) {
//    process.stdout.write('\r' + perc);
  });

  runner.on('bench end', function (results) {
    exports.cursor.CR();
    var ops = humanize(results.ops.toFixed(0));
    var out = indent() + color('  › ', 'gray')
            + ops + color(' op/s', 'gray')
            + ' ' + results.elapsed + color(' ms', 'gray');
    console.log(out);
  });
}

