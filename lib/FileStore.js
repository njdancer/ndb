//FileStore

var Path = require('path');
var fs = require('fs');

var Logger = require('lib/Logger');

var FileStore = module.exports = function(path) {
  this.path = path;
  this.data = {};
  
  //check if path exists and if not create it
  try {
    fs.readdirSync(path);
  }
  catch(e) {
    //data does not exist. create
    if (e.errno == 34) {
      fs.mkdirSync(path, 0755);
    } else {
      throw (e);
    }
  }
};

FileStore.prototype.persist = function(key, value, callback) {
  //write this key/value pair to disk and execute callback on completion
  this.data[key] = value;
  // need to prevent duplicates
  if (this.keyList) this.keyList.push(key);
  fs.writeFile(Path.join(this.path, key), JSON.stringify(value), function(err) {
    if (err) throw err;
    Logger.log('Persisted ' + key);
    callback();
    return this;
  });
};

FileStore.prototype.delete = function(key, callback) {
  //remove this key from storage and execute callback on completion
  fs.unlink(Path.join(this.path, key), function(err) {
    if (err) throw err;
    Logger.log(key + ' removed from disk');
    if (callback !== undefined) callback();
    return this;
  });
};

// FileStore.prototype.get = function(key, callback) {
//   //retrieve value for key and execute callback on completion
//   if (this.data[key]) {
//     callback(this.data[key]);
//   } else {
//     this.load(key, function(data) {
//       callback(data);
//     });
//   }
// };

FileStore.prototype.load = function(key, callback) {
  //retrieve data off disk for key and execute callback on completion
  fs.readFile(Path.join(this.path, key), 'utf8', function (err, data) {
    if (err) {
      // if error is due to missing file then pass null to callback
      if (err.errno == 34) {
        callback(null);
        return this;
      } else {
        // otherwise escalate exception
        throw err;
      }
    }
    
    Logger.log(key + ' loaded off disk');
    callback(data);
  }.bind(this));
};

FileStore.prototype.listKeys = function(callback) {
  fs.readdir(this.path, function(err, files) {
    if (err) throw err;
    callback(files);
  });//, function(err, files) {
  //   if (err) throw err;
  //   callback(files);
  // });
  return this;
};
