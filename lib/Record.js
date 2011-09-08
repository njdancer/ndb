// Record

var uuid = require('node-uuid');
var crypto = require('crypto');

var Record = module.exports = function(args) {
  Object.defineProperty(this, '_model', {value: args.model});
  this.id = uuid();
  
  hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(this));
  Object.defineProperty(this, '_original', {value: hash.digest('base64')});
};

Record.prototype.save = function(callback) {
  this._model.update(this, callback);
};

Record.prototype.destroy = function(callback) {
  this._model.destroy(this.id);
  if (callback) callback();
};
