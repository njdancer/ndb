//Model

// var fs = require('fs');
var Record = require('./Record');
var FileStore = require('./FileStore');
var crypto = require('crypto');

var Model = module.exports = function(dataPath) {
  this.dataPath = dataPath;
  this.data = new FileStore(dataPath);
};

Model.prototype.create = function() {
  return new Record({model: this});
};

Model.prototype.update = function(record, callback) {
  if (this.data[record.key]) {
    hash = crypto.createHash('sha1');
    hash.update(JSON.stringify(this.data[record.key]));
    
    if (hash.digest('base64') != record._original) {
      //data has changed
      if (callback) callback('Data has changed since last query', record);
      return this;
    }
  }
  
  this.data.persist(record.key, JSON.stringify(record), function() {
    if (callback) callback(null, record);
    return this;
  });
};

Model.prototype.find = function(key, callback) {
  this.data.get(key, callback);
  return this;
};

// Model.prototype.filter = function(key, callback) {
//   
// };

Model.prototype.destroy = function(key, callback) {
  this.data.destroy(key, callback);
  return this;
};
