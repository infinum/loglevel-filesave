/**
 * Prepare a logger for persistence to file
 *
 * @param {Logger} logger - Logger instance
 * @param {Object} options - Param object
 * @param {String} options.file - Destination file
 * @param {String} options.prefix - Prefix to be used
 * @param {Number} [options.consoleLevel=logger.levels.SILENT] - Level of messages that should be logged to console
 * @param {Object} [options.fs=require('fs')] - fs library to be used
 * @param {String} [options.separator=require('os').EOL] - Separator to be used between log messages
 * @param {Number} [options.level=logger.levels.WARN] - Level of messages that should be logged to file
 * @return {Logger} Logger instance
 */
module.exports = function(logger, options) {

  var file = options.file;
  var prefix = options.prefix;
  var consoleLevel = options.consoleLevel === undefined ? logger.levels.SILENT : options.consoleLevel;
  var fs = options.fs || require('fs');
  var separator = options.separator || require('os').EOL;
  var level = options.level === undefined ? logger.levels.WARN : options.level;

  if (!logger || !logger.methodFactory) {
    throw new Error('loglevel instance has to be specified in order to be extended');
  }

  var path = require('path');
  var originalFactory = logger.methodFactory;

  // Force create the file to avoid issues with multiple async appends
  fs.writeFileSync(path.resolve(file), '');

  logger.methodFactory = function(methodName, methodLevel) {
    var msgLevel = logger.levels[methodName.toUpperCase()];
    var rawMethod = originalFactory(methodName, methodLevel);

    return function(_message) {
      if (msgLevel >= level) {
        var message = _message;

        if (typeof prefix === 'string') {
          message = prefix + message;
        } else if (typeof prefix === 'function') {
          message = prefix(methodName, message);
        } else {
          message = methodName + ': ' + message;
        }

        fs.appendFileSync(path.resolve(file), message + separator);
      }

      if (msgLevel >= consoleLevel) {
        rawMethod(methodName + ': ' + message);
      }
    };
  };

  logger.setLevel(Math.min(level, consoleLevel));
  return logger;
}
