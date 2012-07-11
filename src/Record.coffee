uuid = require 'node-uuid'
extend = require('lib/Utilities').extend

module.exports = class Record
  constructor: (args) ->
    Object.defineProperty this, '_bucket', value: args.bucket

    Object.defineProperty this, 'key', value: args.key or uuid()

    extend args.data, this
