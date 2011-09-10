// Record

var uuid = require('node-uuid');
var crypto = require('crypto');

var Record = module.exports = function(args) {
  Object.defineProperty(this, '_model', {value: args.model});
  this.key = uuid();
  
  hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(this));
  Object.defineProperty(this, '_original', {value: hash.digest('base64')});
};

Record.prototype.revert = function(callback) {
  this._model.find(this.key, function(data) {
    for (var field in data) {
      this[field] = data[field];
    }
  });
  return this;
};

Record.prototype.save = function(callback) {
  this._model.update(this, callback);
  return this;
};

Record.prototype.destroy = function(callback) {
  this._model.destroy(this.key);
  if (callback) callback();
  return this;
};
