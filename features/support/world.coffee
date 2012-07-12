module.exports = () ->
  @World = (callback) ->
    # could not get should to work without underscore
    # presumably because lib adds should to Object prototype
    @_should = require 'should'
    callback()