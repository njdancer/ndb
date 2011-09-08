//FileStore

var Path = require('path');
var fs = require('fs');

var FileStore = module.exports = function(path) {
  this.path = path;
  this.data = {};
  
  try {
    fs.readdirSync(path);
  }
  catch(e) {
    //data does not exist. create
    if (e.errorNo == 2) {
      fs.mkdirSync(path, 755);
    } else {
      throw (e);
    }
  }
};

FileStore.prototype.persist = function(key, value, callback) {
  fs.writeFile(Path.join(this.path, key), value, function(err) {
    if (err) throw err;
    console.log('Persisted ' + key);
    callback();
  });
};

FileStore.prototype.destroy = function(key, callback) {
  fs.unlink(Path.join(this.path, key), function(err) {
    if (err) throw err;
    console.log(key + ' removed from disk');
    callback();
  });
};

FileStore.prototype.get = function(key, callback) {
  if (this.data[key]) {
    callback(this.data[key]);
    return this;
  } else {
    this.load(key, function(data) {
      callback(JSON.parse(data));
      return this;
    });
  }
};

FileStore.prototype.load = function(key, callback) {
  fs.readFile(Path.join(this.path, key), 'utf8', function (err, data) {
    if (err) throw err;
    callback(data);
  });
};