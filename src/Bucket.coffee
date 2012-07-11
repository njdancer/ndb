Record = require 'src/Record'

module.exports = class Bucket
  constructor: () ->
    @identityMap = {}

  create: () ->
    new Record bucket: this

  update: (key, data, callback) ->
    @identityMap[key] = data
    callback()

  get: (key, callback) ->
    if @identityMap[key]
      callback new Record bucket: this, key: key, data: @identityMap[key]
    else
      callback null

  delete: (key, callback) ->
    @identityMap[key] = undefined
    callback()
