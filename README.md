# loglevel-filesave

Loglevel plugin for saving logs to the file

[![Build Status](https://travis-ci.org/infinum/loglevel-filesave.svg?branch=master)](https://travis-ci.org/infinum/loglevel-filesave)
[![Dependency Status](https://david-dm.org/infinum/loglevel-filesave.svg)](https://david-dm.org/infinum/loglevel-filesave)
[![devDependency Status](https://david-dm.org/infinum/loglevel-filesave/dev-status.svg)](https://david-dm.org/infinum/loglevel-filesave#info=devDependencies)

## Instalation

    npm install loglevel-filesave

## Usage

When the module is required it returns a function that accepts two arguments:
* logger - Loglevel logger instance
* options - Object with various options
  * file - Path to the file where the log should be written
  * prefix - String or a function (receives methodName and message as arguments) that will be used to format the logged message.
    * Default: ``methodName + ': ' + message``
  * consoleLevel - Level of the messages that should be passed trough to the console (default loglevel behaviour).
    * Default: ``logger.levels.SILENT``
  * fs - Filesystem module that should be used. Default: ``require('fs')``
  * separator - Separator that should be used between entries:
    * Default: ``require('os').EOL`` (depends on the system)
  * level - Level of messages that should be written to the file.
    * Default: ``logger.levels.WARN``

### Example

    var loglevel = require('loglevel');
    var fileSave = require('loglevel-filesave');

    var logger = loglevel.getLogger('log');
    fileSave(logger, {file: 'log.txt'});

## Requirements

* Should work on all versions of Node.js
* Dev requirement: Node.js 6.3+

## TODO

* Add an option to use bulk saves

## License
[MIT License](LICENSE)
