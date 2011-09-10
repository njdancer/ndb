//FileStore

var Path = require('path');
var fs = require('fs');

var FileStore = module.exports = function(path) {
  this.path = path;
  this.data = {};
  
  //check if path exists and if not create it
  try {
    fs.readdirSync(path);
  }
  catch(e) {
    //data does not exist. create
    if (e.errno == 2) {
      fs.mkdirSync(path, 755);
    } else {
      throw (e);
    }
  }
};

FileStore.prototype.persist = function(key, value, callback) {
  //write this key/value pair to disk and execute callback on completion
  this.data[key] = value;
  if (this.keyList) this.keyList.push(key);
  fs.writeFile(Path.join(this.path, key), value, function(err) {
    if (err) throw err;
    console.log('Persisted ' + key);
    callback();
    return this;
  });
};

FileStore.prototype.destroy = function(key, callback) {
  //remove this key from storage and execute callback on completion
  delete this.data[key];
  fs.unlink(Path.join(this.path, key), function(err) {
    if (err) throw err;
    console.log(key + ' removed from disk');
    callback();
    return this;
  });
};

FileStore.prototype.get = function(key, callback) {
  //retrieve value for key and execute callback on completion
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
  //retrieve data off disk for key and execute callback on completion
  fs.readFile(Path.join(this.path, key), 'utf8', function (err, data) {
    if (err) {
      if (err.errno == 2) {
        callback(null);
        return this;
      } else {
        throw err;
      }
    }
    this.data[key] = data;
    callback(data);
    return this;
  }.bind(this));
};

FileStore.prototype.listKeys = function(callback) {
  if (this.keyList) {
    callback(this.keyList);
    return this;
  } else {
    fs.readdir(this.path, function(err, files) {
      if (err) throw err;
      this.keyList = files;
      callback(this.keyList);
    });
  }
};
