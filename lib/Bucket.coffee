Record = require './Record'
FileStore = require './FileStore'

module.exports = class Bucket
  constructor: (dataPath) ->
    throw 'dataPath is required' unless dataPath
    @identityMap = {}
    @fileStore = new FileStore dataPath

  create: () ->
    new Record bucket: this

  update: (key, data, callback) ->
    # fire this off asynchronously with no callback
    # TODO: pass in callback as form of exception handler
    @fileStore.persist key, data
    @identityMap[key] = data
    callback()

  get: (key, callback) ->
    record = (data) =>
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
    @fileStore.delete key, =>
      @identityMap[key] = undefined
      callback()
