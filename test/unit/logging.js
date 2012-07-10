var assert = require('assert');
var sinon = require('sinon');
var should = require('should');

var Logger = require('lib/Logger');

describe('logger', function() {
  var spy;
  before(function() {
    spy = sinon.spy(process.stdout, 'write');
  });
  
  describe('#log', function() {
    it('should add date and time to log string', function() {
      var message = 'Hello World!';
      Logger.log('Hello World!');
      // spy.args[0][0].should.equal("Hello World!\n");
      // [YYYY-MM-DD-HH:MM:SS]
      spy.args[0][0].should.match(/\[\d\d\d\d-\d\d-\d\d-\d\d:\d\d:\d\d\] Hello World!\n/);
    });
  });
  
  after(function() {
    spy.restore();
  });
});