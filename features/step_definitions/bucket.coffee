Bucket = require '../../lib/Bucket'
should = require 'should'

module.exports = bucketSteps = ->
  @Given /^a bucket exists$/, (callback) ->
    @bucket = new Bucket 'tmp/data/bucket'
    callback()

  @Then /^I should be able to retrieve that record from the bucket$/, (callback) ->
    @bucket.get @record.key, (data) =>
      should.exist data
      data.should.eql @record
      callback()

  @Then /^I should not be able to retrieve that record from the bucket$/, (callback) ->
    @bucket.get @record.key, (data) ->
      should.not.exist data
      callback()

  @When /^I create a bucket$/, (callback) ->
    @bucket = new Bucket 'tmp/data/bucket'
    callback()
