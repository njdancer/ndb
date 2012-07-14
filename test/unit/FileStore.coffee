# Dependencies
path = require 'path'
fs = require 'fs'
wrench = require 'wrench'
path = require 'path'
uuid = require('node-uuid').v4
should = require 'should'

# Module Under Test
FileStore = require '../../lib/FileStore'

describe 'FileStore', () ->
  fileStore = null
  dataPath = null
  before () ->
    dataPath = 'tmp/data/bucket'
    dataFolder = path.resolve(dataPath, '..')
    if fs.existsSync(dataFolder) then wrench.rmdirSyncRecursive dataFolder
    fileStore = new FileStore dataPath

  describe 'instantiation', () ->
    it 'should store fully resolved dataPath', () ->
      fileStore.dataPath.should.equal path.resolve(dataPath)

    it 'should create dataPath if it doesnt already exist', () ->
      fs.existsSync(dataPath).should.be.true

  describe 'persist', () ->
    key = uuid()
    data =
      title: 'Hello World'
      test: 12345
    before (done) ->
      fileStore.persist key, data, done

    it 'should persist record to file', () ->
      file = JSON.parse fs.readFileSync(path.join(fileStore.dataPath, key), 'utf8')
      data.should.eql file

  describe 'retrieve', () ->
    describe 'key exists', () ->
      it 'should retrieve data off file', (done) ->
        key = uuid()
        data = title: "Hello World"
        fileStore.persist key, data, () ->
          fileStore.retrieve key, (_data) ->
            _data.should.eql data
            done()

    describe 'key does not exist', () ->
      before () ->
        @key = uuid()

      it 'should pass null to callback', (done) ->
        fileStore.retrieve @key, (data) ->
          should.strictEqual data, null
          done()

      it 'should not throw an exception', () ->
        (=> fileStore.retrieve @key, (data) ->).should.not.throw()
