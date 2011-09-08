//Model

// var fs = require('fs');
var Record = require('./Record');
var crypto = require('crypto');

var Model = module.exports = function(dataPath) {
  // try {
  //   files = fs.readdirSync(dataPath);
  //   //data exists. load
  //   files.forEach(function(filename) {
  //     data = fs.readFileSync(dataPath + '/' + filename);
  //     console.log(filename + ' contains ' + data);
  //   });
  // }
  // catch(e) {
  //   //data does not exist. create
  //   if (e.errorNo == 2) {
  //     fs.mkdirSync(dataPath, 755);
  //   } else {
  //     throw (e);
  //   }
  // }
  this.data = {};
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
  
  this.data[record.id] = record;
  if (callback) callback(null, record);
};

Model.prototype.find = function(id) {
  return this.data[id];
};

Model.prototype.destroy = function(id) {
  delete this.data[id];
};
