Record = require './Record'
FileStore = require './FileStore'

module.exports = class Bucket
  constructor: (dataPath) ->
    throw 'dataPath is required' unless dataPath
    @identityMap = {}
    @fileStore = new FileStore dataPath

  create: ->
    new Record bucket: this

  update: (key, data, callback) ->
    # Don't wait for file write in favour of speed
    # fire this off asynchronously with no callback
    # This is currently assuming that write will not fail
    # TODO: pass in callback as form of exception handler
    @fileStore.persist key, data
    @identityMap[key] = data
    process.nextTick callback

  get: (key, callback) ->
    record = (data) =>
      process.nextTick =>
        callback new Record bucket: this, key: key, data: @identityMap[key]
    if @identityMap[key]
      record @identityMap[key]
    else
      @fileStore.retrieve key, (data) =>
        if data is null
          callback null
        else
          @identityMap[key] = data
          record data


  delete: (key, callback) ->
    # Don't wait for file deletion in favour of speed
    # TODO: pass in callback as form of exception handler
    @fileStore.delete key
    @identityMap[key] = undefined
    process.nextTick callback
