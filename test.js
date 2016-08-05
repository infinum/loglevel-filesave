const {expect} = require('chai');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const fs = require('fs');
const separator = require('os').EOL;

const loglevel = require('loglevel');
const filesave = require('./index');

describe('loglevel-filesave', function() {
  beforeEach(function() {
    mock({});
  });

  afterEach(function() {
    mock.restore();
  });

  it('should log all messages', function() {
    const logger = loglevel.getLogger('test');
    filesave(logger, {
      file: 'basicTest.log',
      level: logger.levels.TRACE
    });

    logger.error('Test');
    fs.accessSync('basicTest.log'); // Will throw if it doesn't exist
    expect(fs.readFileSync('basicTest.log', 'utf8')).to.equal('error: Test' + separator);
  });

  it('should use a string prefix', function() {
    const logger = loglevel.getLogger('test');
    filesave(logger, {
      file: 'stringPrefixTest.log',
      level: logger.levels.TRACE,
      prefix: 'Foo!'
    });

    logger.error('Test');
    fs.accessSync('stringPrefixTest.log'); // Will throw if it doesn't exist
    expect(fs.readFileSync('stringPrefixTest.log', 'utf8')).to.equal('Foo!Test' + separator);
  });

  it('should use a function prefix', function() {
    const logger = loglevel.getLogger('test');
    filesave(logger, {
      file: 'functionPrefixTest.log',
      level: logger.levels.TRACE,
      prefix: (methodName, message) => `[${methodName}]: ${message}`
    });

    logger.error('Test');
    fs.accessSync('functionPrefixTest.log'); // Will throw if it doesn't exist
    expect(fs.readFileSync('functionPrefixTest.log', 'utf8')).to.equal('[error]: Test' + separator);
  });

  it('should use a custom separator', function() {
    const logger = loglevel.getLogger('test');
    filesave(logger, {
      file: 'customSeparatorTest.log',
      level: logger.levels.TRACE,
      separator: '.'
    });

    logger.error('Test');
    fs.accessSync('customSeparatorTest.log'); // Will throw if it doesn't exist
    expect(fs.readFileSync('customSeparatorTest.log', 'utf8')).to.equal('error: Test.');
  });

  it('should use sync methods', function() {
    const logger = loglevel.getLogger('test');
    filesave(logger, {
      file: 'syncTest.log',
      level: logger.levels.TRACE
    });

    logger.trace('Trace');
    logger.debug('Debug');
    logger.info('Info');
    logger.warn('Warn');
    const messages = [
      'trace: Trace',
      'debug: Debug',
      'info: Info',
      'warn: Warn'
    ];

    fs.accessSync('syncTest.log'); // Will throw if it doesn't exist
    expect(fs.readFileSync('syncTest.log', 'utf8')).to.equal(messages.join(separator) + separator);
  });

  it('should log only selected levels', function() {
    const logger = loglevel.getLogger('test');
    filesave(logger, {
      file: 'levelTest.log',
      level: logger.levels.INFO
    });

    logger.trace('Trace');
    logger.debug('Debug');
    logger.info('Info');
    logger.warn('Warn');
    const messages = [
      'info: Info',
      'warn: Warn'
    ];

    fs.accessSync('levelTest.log'); // Will throw if it doesn't exist
    expect(fs.readFileSync('levelTest.log', 'utf8')).to.equal(messages.join(separator) + separator);
  });
});
