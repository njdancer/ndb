Bucket = require '../../lib/Bucket'
Record = require '../../lib/Record'
uuid = require('node-uuid').v4
should = require 'should'

bucket = null

describe 'Bucket', () ->
  before () ->
    bucket = new Bucket process.env['NODE_PATH'] + '/tmp/data/users'

  describe 'instantiation', () ->
    it 'should accept a path and return a new Bucket', () ->
      bucket.should.be.an.instanceOf Bucket

  describe 'create', () ->
    it 'should return an instance of Record', () ->
      record = bucket.create()
      record.should.be.an.instanceOf Record
      it 'should have a reference to its bucket', () ->
        record._bucket.should.equal bucket

  describe 'update', () ->
    it 'should persist data to internal store', (done) ->
      key = uuid()
      bucket.update key, title: 'data', () ->
        bucket.identityMap[key].should.have.property 'title', 'data'
        done()

  describe 'get', () ->
    describe 'key exists', () ->
      record = null
      before (done) ->
        bucket.identityMap[key = uuid()] = title: 'some more data'
        bucket.get key, (data) ->
          record = data;
          done()

      it 'should retrieve data from internal store', () ->
        record.should.have.property 'title', 'some more data'

      it 'should return an instance of Record', () ->
        record.should.be.an.instanceOf Record

    describe 'key does not exist', () ->
      it 'should receive null passed to its callback', (done) ->
        bucket.get uuid(), (data) ->
          should.not.exist data
          done()

  describe 'delete', () ->
    it 'should remove data from internal store', (done) ->
      bucket.identityMap[key = uuid()] = title: 'some more data'
      bucket.delete key, () ->
        should.not.exist bucket.identityMap[key]
        done()
