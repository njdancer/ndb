var utilities = require('lib/Utilities');

describe('utilities', function() {
  describe('replace', function() {
    it('should make object a look like object b', function() {
      var a = {apples: 10, oranges: 20};
      var b = {apples: 20, bananas: 30};
      
      utilities.replace(a, b);
      
      a.should.not.have.property('oranges');
      a.should.have.property('bananas');
      a['apples'].should.equal(20);
    });
  });
});