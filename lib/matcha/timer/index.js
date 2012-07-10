module.exports = process && 'function' === typeof process.hrtime
  ? require('./node')
  : require('./browser');
