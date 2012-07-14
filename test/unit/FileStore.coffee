# Dependencies
path = require 'path'
fs = require 'fs'
wrench = require 'wrench'
path = require 'path'
uuid = require('node-uuid').v4

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
