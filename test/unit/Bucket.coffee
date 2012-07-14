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
    it 'should create a FileStore', () ->
      bucket.fileStore.should.exist
      bucket.fileStore.should.be.an.instanceOf FileStore
      bucket.fileStore.dataPath.should.equal path.resolve(dataPath)
    it 'should throw exception with no dataPath', () ->
      # TODO: allow purely in memory option
      (-> new Bucket).should.throw()

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

      describe 'record not in internal store', () ->
        before (done) ->
          @key = uuid()
          @data = title: "Hello World"
          bucket.fileStore.persist @key, @data, =>
            bucket.get @key, (record) =>
              @record = record
              done()

        it 'should retrieve data from FileStore', () ->
          @record.should.eql @data

        it 'should return an instance of Record', () ->
          @record.should.be.an.instanceOf Record

      it 'should return an instance of Record', () ->
        record.should.be.an.instanceOf Record

    describe 'key does not exist', () ->
      # TODO: change this to undefined
      it 'should receive null passed to its callback', (done) ->
        bucket.get uuid(), (data) ->
          should.not.exist data
          done()

  describe 'delete', ->
    before (done) ->
      @record = bucket.create()

      @record.key = uuid()
      @record.title = 'some more data'

      @record.save =>
        bucket.delete @record.key, done

    it 'should remove data from internal store', ->
      should.not.exist bucket.identityMap[@record.key]

    it 'should remove data from FileStore', (done) ->
      bucket.fileStore.retrieve @record.key, (data) ->
        should.not.exist data
        done()
