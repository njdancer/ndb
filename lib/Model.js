//Model

// var fs = require('fs');
var Record = require('./Record');
var FileStore = require('./FileStore');
var Checklist = require('./Utilities').Checklist;
var clone = require('./Utilities').clone;
var crypto = require('crypto');

var Model = module.exports = function(dataPath) {
  this.dataPath = dataPath;
  // this.fileStore = new FileStore(dataPath);
  this.identityMap = {};
};

Model.prototype.create = function() {
  // create empty record
  return new Record({model: this});
};

Model.prototype.update = function(record, callback) {
  // callback accepts error message
  if (record.outdated()) {
    // if persisted data has changed since proxy was last updated
    if (callback) callback('Data has changed since last query');
  } else {
    this.identityMap[record.key] = clone(record);
    if (callback) callback();
  }
  // this.fileStore.persist(record.key, record, function() {
  //   if (callback) callback(null, record);
  //   return this;
  // });
  // return this for chaining
  return this;
};

Model.prototype.get = function(key, callback) {
  // this.fileStore.get(key, function(data) {
  //   if (data === null) {
  //     callback(null);
  //     return this;
  //   } else {
  //     var record = new Record({key: key, model: this, data: data});
  //     callback(record);
  //   }
  // }.bind(this));
  if (this.identityMap[key] === undefined) {
    // If the record does not currently exist pass null to callback
    callback(null);
  } else {
    // otherwise fetch data and create proxy object to pass to callback
    var proxy = new Record({key: key, model: this, data: this.identityMap[key]});
    callback(proxy);
  }
  
  // return this for chaining
  return this;
};

Model.prototype.filter = function(filter, callback) {
  this.fileStore.listKeys(function(keys) {
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

Model.prototype.map = function(mutator, callback) {
  this.fileStore.listKeys(function(keys) {
    var results = {};
    var checklist = new Checklist(keys.length, function() {
      callback(results);
    });
    keys.forEach(function(key) {
      this.get(key, function(data) {
        mutator(data);
        results[key] = data;
        checklist.check();
      });
    }, this);
  }.bind(this));
};

Model.prototype.delete = function(key, callback) {
  // remove this key from identity map so no further lookups can be performed
  this.identityMap[key] = undefined;
  // execute callback if it exists
  if (callback) callback();
  
  // return this for chaining
  return this;
};
