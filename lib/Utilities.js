// Utilities

var Checklist = exports.Checklist = function(length, callback) {
  this.length = length;
  this.callback = callback;
};

Checklist.prototype.check = function() {
  if (this.length <= 1) this.callback();
  else this.length--;
};

var extend = exports.extend = function(source, dest){
  for(var key in source) {
    dest[key] = clone(source[key]);
  }
};

var clone = exports.clone = function(obj){
  if(obj === null || typeof(obj) != 'object')
      return obj;

  var temp = obj.constructor(); // changed

  for(var key in obj)
      temp[key] = clone(obj[key]);
  return temp;
};
