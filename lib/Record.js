// Record

var uuid = require('node-uuid');
var crypto = require('crypto');
var extend = require('./Utilities').extend;
var replace = require('./Utilities').replace;

var Record = module.exports = function Record(args) {
  Object.defineProperty(this, '_model', {value: args.model});
  
  extend(args.data, this);
  Object.defineProperty(this, 'key', {value: args.key || uuid()});
  
  Object.defineProperty(this, '_fingerprint', {value: this.generateFingerprint()});
};

Object.defineProperty(Record.prototype, 'generateFingerprint', {value: function() {
  // generate fingerprint of current enumerable properties
  var hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(this));
  var digest = hash.digest('base64');
  
  return digest;
}});

Object.defineProperty(Record.prototype, 'resetFingerprint', {value: function() {
  this._fingerprint = this.generateFingerprint();
}});

Object.defineProperty(Record.prototype, 'revert', {value: function(callback) {
  // replace all enumerable properties on this with original data
  replace(this, this._model.identityMap[this.key]);
  
  // return this for chaining
  return this;
}});

Object.defineProperty(Record.prototype, 'outdated', {value: function() {
  if (this._model.identityMap[this.key] === undefined) return false;
  
  var hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(this._model.identityMap[this.key]));
  var digest = hash.digest('base64');
  
  return digest !== _fingerprint;
}});

Object.defineProperty(Record.prototype, 'save', {value: function(callback) {
  // update data stored in bucket
  this._model.update(this, callback);
  // update the record's fingerprint
  this.resetFingerprint();
  return this;
}});

Object.defineProperty(Record.prototype, 'remove', {value: function(callback) {
  // remove this object from its bucket. Does not damage record itself and can be reinserted with save
  this._model.delete(this.key, callback);
  // return this for chaining
  return this;
}});
