module.exports = recordSteps = () ->
  @When /^I create a record with data$/, (callback) ->
    @record = @bucket.create()

    @record.title = "My title"
    @record.data = 
      value1: 'test'
      value2: 'again'

    callback()

  @When /^I save that record$/, (callback) ->
    @record.save callback

  @Given /^a record exists$/, (callback) ->
    # TODO: call Given a bucket exists to ensure fresh bucket is available
    @record = @bucket.create()
    @record.title = "Hello World"
    @record.save callback

  @When /^I remove that record$/, (callback) ->
    @record.remove callback
