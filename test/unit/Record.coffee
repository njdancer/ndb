Record = require 'src/Record'
uuid = require('node-uuid').v4
sinon = require 'sinon'

bucket = null
record = null

describe 'Record', () ->
  before () ->
    bucket = update: sinon.stub()
    bucket.update.callsArg 2
    record = new Record bucket: bucket

  describe 'instantiation', () ->
    it 'should generate its own unique identifier', () ->
      record.key.should.match /^[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/

    it 'should accept and store a reference to its bucket', () ->
      record.should.be.an.instanceOf Record
      record.should.have.property '_bucket', bucket

    it 'should start empty', () ->
      propertyCount = 0
      for key of record
        propertyCount++
      propertyCount.should.equal 0

    describe 'reinstantiation', () ->
      before () ->
        record = new Record bucket: bucket, key: uuid, data: {title: 'some test data', 'title 2': 'even more data'}

      it 'should accept and store a copy of its own data', () ->
        record.should.have.property 'title', 'some test data'
        record.should.have.property 'title 2', 'even more data'

  describe 'save', () ->
    it 'should update bucket with new data', (done) ->
      record.title = "Hello World!"
      record.save () ->
        bucket.update.calledWith(record.key, record).should.equal true
        bucket.update.calledOnce.should.equal true
        done()
