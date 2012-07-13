Bucket = require '../../lib/Bucket'
should = require 'should'

module.exports = bucketSteps = () ->
  @Given /^a bucket exists$/, (callback) ->
    @bucket = new Bucket()
    callback()

  @Then /^I should be able to retrieve that record from its bucket$/, (callback) ->
    @bucket.get @record.key, (data) =>
      data.should.eql @record
      callback()

  @Then /^I should not be able to retrieve that record from its bucket$/, (callback) ->
    @bucket.get @record.key, (data) ->
      should.not.exist data
      callback()
