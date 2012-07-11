Record = require 'src/Record'
uuid = require('node-uuid').v4

bucket = null
record = null

describe 'Record', () ->
  before () ->
    bucket = {}
    record = new Record bucket: bucket

  describe 'instantiation', () ->
    it 'should generate its own unique identifier', () ->
      record.key.should.match /^[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/

    it 'should accept and store a reference to its bucket', () ->
      record.should.be.an.instanceOf Record
      record.should.have.property '_bucket', bucket

    describe 'reinstantiation', () ->
      before () ->
        record = new Record bucket: this, key: uuid, data: {title: 'some test data', 'title 2': 'even more data'}

      it 'should accept and store a copy of its own data', () ->
        record.should.have.property 'title', 'some test data'
        record.should.have.property 'title 2', 'even more data'
