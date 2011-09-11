//Model

// var fs = require('fs');
var Record = require('./Record');
var FileStore = require('./FileStore');
var Checklist = require('./Utilities').Checklist;
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

Model.prototype.get = function(key, callback) {
  this.data.get(key, function(data) {
    if (data === null) return null;
    callback(new Record({model: this, data: data}));
  });
};

Model.prototype.filter = function(filter, callback) {
  this.data.listKeys(function(keys) {
    var results = {};
    var checklist = new Checklist(keys.length, function() {
      callback(results);
    });
    keys.forEach(function(key) {
      this.get(key, function(data) {
        if (filter(data)) {
          results[data.key] = data;
        }
        checklist.check();
      });
    }, this);
  }.bind(this));
};

Model.prototype.destroy = function(key, callback) {
  this.data.destroy(key, callback);
  return this;
};
