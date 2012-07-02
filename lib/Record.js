// Record

var uuid = require('node-uuid');
var crypto = require('crypto');
var extend = require('./Utilities').extend;

var Record = module.exports = function(args) {
  Object.defineProperty(this, '_model', {value: args.model});
  
  extend(args.data, this);
  Object.defineProperty(this, 'key', {value: args.key || uuid()});
  
  var hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(this));
  var digest = hash.digest('base64');
  
  Object.defineProperty(this, '_original', {value: digest});
  console.log(this);
};

Object.defineProperty(Record.prototype, 'revert', {value: function(callback) {
  this._model.find(this.key, function(data) {
    for (var field in data) {
      this[field] = data[field];
    }
  });
  return this;
}});

Object.defineProperty(Record.prototype, 'save', {value: function(callback) {
  this._model.update(this, callback);
  return this;
}});

Object.defineProperty(Record.prototype, 'destroy', {value: function(callback) {
  this._model.destroy(this.key);
  if (callback) callback();
  return this;
}});
