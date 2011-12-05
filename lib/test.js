
module.exports = Test;

function Test (parent, name, test, options) {
  this.parent = parent;
  this.name = name;
  this.test = test;
  this.options = options;
}

Test.prototype.run = function (iterations, callback) {
  var self = this
    , i = iterations
    , pending = i
    , start = new Date()
    , heapStart = process.memoryUsage();
  
  this.callback = this.callback || callback || function () {};
  
  var nextStatic = function () {
    if (--pending === 0) {
      var elapsed = new Date() - start;
      self.callback({
        iterations: iterations,
        elapsed: elapsed
      });
    }
  };
  
  var nextAdaptive = function () {
    if (--pending === 0) {
      var elapsed = new Date() - start
        , heapEnd = process.memoryUsage();
      
      if (elapsed < self.options.min) {
        self.run(iterations * 2);
      } else {
        self.callback({
          iterations: iterations, 
          elapsed: elapsed,
          memory: {
            start: heapStart,
            end: heapEnd
          }
        });
      }
    }
  };
  
  var next = self.options.type == 'adaptive' ? nextAdaptive : nextStatic;
  
  while (i--) {
    this.test(next);
  }
};