
suite('existence', function () {
  var foo = { c: 'hey' }
    , bar = { __proto__: foo, b: 'hey' }
    , obj = { __proto__: bar, a: 'hey' };

  before(function (done) {
    setTimeout(done, 1000);
  });

  after(function (done) {
    setTimeout(done, 1000);
  });

  bench('\'bar\' in foo', function(next){
    'a' in obj;
    'b' in obj;
    'c' in obj;
    next();
  });

  bench('foo.prop', function(next){
    obj.a;
    obj.b;
    obj.c;
    next();
  });

  bench('foo.hasOwnProperty()', function(next){
    obj.hasOwnProperty('a');
    obj.hasOwnProperty('b');
    obj.hasOwnProperty('c');
    next();
  });
});
