/*!
 * Matcha - cli router
 * Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , matcha = require('../matcha')
  , help = [];

/*!
 * Create our event driven CLI
 */

var cli = new EventEmitter;

/**
 * Event for submodules to register help commands
 */

cli.on('--register', function (_help) {
  help.push(_help);
});

/**
 * Display the help info
 */

cli.on('--help', function (args) {
  console.log(help);
});

/**
 * Quick print of version
 */

cli.on('--version', function () {
  console.log(matcha.version);
});

/**
 * Load all the CLI submodules, executing
 * their export, passing the cli to events.
 */

require('./cli/runner')(cli);

/*!
 * Main exports
 */

module.exports = function (command, args) {
  // if no command, check for basics
  if (command.length == 0) {
    if (args.v || args.version) command = '--version';
    if (args.h || args.help) command = '--help';
  }

  if (process.env.DEBUG) {
    console.log(args);
  }

  cli.emit(command, args);
};
