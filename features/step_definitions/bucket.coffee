Bucket = require 'src/Bucket'

module.exports = bucketSteps = () ->
  @Given /^a bucket exists$/, (callback) ->
    @bucket = new Bucket()
    callback()
