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
