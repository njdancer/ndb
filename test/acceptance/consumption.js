var fs = require('fs');
var should = require('should');

var Model = require('lib/Model');

var Post = new Model(process.env['NODE_PATH'] + '/tmp/data/posts');

describe('Consumption Interface', function() {
  describe('definition', function() {
    before(function() {
      try {
        fs.rmdirSync(process.env['NODE_PATH'] + '/tmp/data/users');
      } catch (e) {
        if (e.errno != 34) throw e;
      }
    });
    it("should take a filepath and create model", function() {
      var User = new Model(process.env['NODE_PATH'] + '/tmp/data/users');
    });
    
    // describe('with pre-existing data', function() {
    //   it("should take a filepath and load existing data", function() {
    //     var Post = new Model(process.env['NODE_PATH'] + '/tmp/data/Post');
    //   });
    // };
    
  });
  
  describe('creating model instance', function() {
    it("should create a new record of its own model which should have a unique hash", function() {
      var post = Post.create();
      
      post._model.should.equal(Post);
      post.should.have.property('key');
    });
  });
  
  describe('saving data', function() {
    it("should persist data", function(done) {
      var post = Post.create();
      
      // Schema does not need to be defined
      post.title = "Hello World!";
      post.description = "Lorem Ipsum...";
      
      post.save();
      
      Post.get(post.key, function(data) {
        data.title.should.equal(post.title);
        data.description.should.equal(post.description);
        done();
      });
    });
  });
  
  describe('removing data', function() {
    it("should no longer be accessible once removed from bucket", function(done) {
      var post = Post.create();
      
      post.save();
      
      Post.get(post.key, function(data) {
        should.exist(data);
        post.remove(function() {
          Post.get(post.key, function(data) {
            // console.log(data.key);
            // should.not.exist(data);
            done();
          });
        });
      });
    });
  });
});