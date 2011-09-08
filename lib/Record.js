// Record

var uuid = require('node-uuid');

var Record = module.exports = function(args) {
  Object.defineProperty(this, '_model', {value: args.model});
  this.id = uuid();
};

Record.prototype.save = function(callback) {
  this._model.update(this);
  if (callback) callback();
};

Record.prototype.destroy = function(callback) {
  this._model.destroy(this.id);
  if (callback) callback();
};
