// Utilities

var Checklist = exports.Checklist = function(length, callback) {
  this.length = length;
  this.callback = callback;
};

Checklist.prototype.check = function() {
  if (this.length <= 1) this.callback();
  else this.length--;
};