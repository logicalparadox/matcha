var EventEmitter = require('events').EventEmitter;

module.exports = Suite;

function Suite (title) {
  this.title = title || '';
  this.benches = [];
  this.suites = [];
  this.before = [];
  this.after = [];
  this.options = {
      type: 'adaptive'
    , iterations: 100
    , mintime: 500
    , silent: true
    , delay: 100
  };
}

Suite.create = function (parent, title) {
  var suite = new Suite(title);
  parent.addSuite(suite);
  return suite;
}

Suite.prototype.__proto__ = EventEmitter.prototype;

Suite.prototype.addSuite = function (suite) {
  suite.parent = this;
  this.suites.push(suite);
};

Suite.prototype.addBench = function (bench) {
  bench.parent = this;
  this.benches.push(bench);
};

Suite.prototype.setOption = function (key, value) {
  this.options[key] = value;
};

Suite.prototype.addBefore = function (fn) {
  this.before.push(fn);
};

Suite.prototype.addAfter = function (fn) {
  this.after.push(fn);
};
