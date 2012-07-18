# Dependencies
fs = require 'fs'
path = require 'path'
wrench = require 'wrench'

module.exports = class FileStore
  constructor: (dataPath) ->
    @dataPath = path.resolve dataPath
    wrench.mkdirSyncRecursive @dataPath, '0755'

  persist: (key, data, callback) ->
    json = JSON.stringify data
    recordPath = path.join @dataPath, key
    fs.writeFile recordPath, json, (err) ->
      if err
        throw err
      callback?()

  retrieve: (key, callback) ->
    fs.readFile path.join(@dataPath, key), 'utf8', (err, data) ->
      if err
        if err.errno is 34
          # ENOENT
          # File does not exist
          callback null
        else
          throw err
      else
        callback JSON.parse(data)

  delete: (key, callback) ->
    fs.unlink path.join(@dataPath, key), (err) ->
      if err then throw err
      callback?()
