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
  if (this.data[record.id]) {
    hash = crypto.createHash('sha1');
    hash.update(JSON.stringify(this.data[record.id]));
    
    if (hash.digest('base64') != record._original) {
      //data has changed
      if (callback) callback('Data has changed since last query', record);
      return this;
    }
  }
  
  this.data.persist(record.id, JSON.stringify(record), function() {
    if (callback) callback(null, record);
    return this;
  });
};

Model.prototype.find = function(id, callback) {
  this.data.get(id, callback);
  return this;
};

Model.prototype.destroy = function(id, callback) {
  this.data.destroy(id, callback);
  return this;
};
