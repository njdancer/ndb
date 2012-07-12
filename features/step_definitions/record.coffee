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

  @Then /^I should be able to retrive that record$/, (callback) ->
    @bucket.get @record.key, (data) =>
      data.should.eql @record
      callback()
