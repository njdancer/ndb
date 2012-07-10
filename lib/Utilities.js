// Utilities

var Checklist = exports.Checklist = function(length, callback) {
  this.length = length;
  this.callback = callback;
};

Checklist.prototype.check = function() {
  if (this.length <= 1) this.callback();
  else this.length--;
};

var extend = exports.extend = function(source, dest) {
  for(var key in source) {
    dest[key] = clone(source[key]);
  }
};

var clone = exports.clone = function(obj) {
  // if obj is not an object return it immediately
  if(obj === null || typeof(obj) != 'object')
      return obj;

  // otherwise create new object
  var temp = {}; // changed

  // and copy in each property recursing through clone
  for(var key in obj)
      temp[key] = clone(obj[key]);
  // return cloned object
  return temp;
};

var replace = exports.replace = function(a, b) {
  for (var key in a) {
    a[key] = undefined;
  };
  
  for (var key in b) {
    a[key] = b[key];
  };
};
