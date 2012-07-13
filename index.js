try {
  module.exports = require('./lib/Bucket');
} catch(e) {
  require('coffee-script');
  module.exports = require('./lib/Bucket');
}
console.log(require.resolve('./lib/Bucket'));