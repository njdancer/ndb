path = require 'path'
Bucket = require '../../lib/Bucket'
# TODO: should be removed to help guarantee isolation during unit tests.
Record = require '../../lib/Record'
FileStore = require '../../lib/FileStore'
uuid = require('node-uuid').v4
should = require 'should'
sinon = require 'sinon'


describe 'Bucket', () ->
  bucket = null
  dataPath = 'tmp/data/bucket'
  before () ->
    bucket = new Bucket dataPath

  describe 'instantiation', () ->
    it 'should return an instance of Bucket', () ->
      bucket.should.be.an.instanceOf Bucket
    it 'should accept a path and create a FileStore', () ->
      bucket.fileStore.should.exist
      bucket.fileStore.should.be.an.instanceOf FileStore
      bucket.fileStore.dataPath.should.equal path.resolve(dataPath)

  describe 'create', () ->
    it 'should return an instance of Record', () ->
      record = bucket.create()
      record.should.be.an.instanceOf Record
      it 'should have a reference to its bucket', () ->
        record._bucket.should.equal bucket

  describe 'update', () ->
    key = null
    before (done) ->
      key = uuid()
      sinon.spy bucket.fileStore, 'persist'
      bucket.update key, title: 'data', done

    it 'should persist data to internal store', () ->
      bucket.identityMap[key].should.have.property 'title', 'data'
      
    it 'should persist data to FileStore', () ->
      bucket.fileStore.persist.called.should.be.true

    after () ->
      bucket.fileStore.persist.restore()

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
