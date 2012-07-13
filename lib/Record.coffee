uuid = require 'node-uuid'
extend = require('./Utilities').extend

module.exports = class Record
  constructor: (args) ->
    Object.defineProperty this, '_bucket', value: args.bucket

    Object.defineProperty this, 'key', value: args.key or uuid()

    extend args.data, this

Object.defineProperty Record.prototype, 'save', value: (callback) ->
  @_bucket.update @key, this, callback

Object.defineProperty Record.prototype, 'remove', value: (callback) ->
  @_bucket.delete @key, callback
