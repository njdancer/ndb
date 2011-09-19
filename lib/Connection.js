// Connection

var Connection = module.exports = function(args) {
  this.node = args.node;
  this.socket = args.socket;
  this.buffer = '';
  
  this.socket.setEncoding('utf8');
  this.socket.on('data', this.receive.bind(this));
  
  this.socket.write('IDENTIFY ' + this.node.key + '\n');
};

Object.defineProperty(Connection.prototype, 'receive', {value: function(data) {
  var tokens = data.split('\n');
  tokens[0] += this.buffer;
  while (tokens.length > 1) {
    this.dispatch(tokens.shift());
  }
  this.buffer = tokens[0];
}});

Object.defineProperty(Connection.prototype, 'dispatch', {value: function(token) {
  commandMap[token.split(' ')[0]].bind(this)(token);
}});

var commandMap = {
  IDENTIFY: function(token) {
    var remoteKey = token.match(/IDENTIFY (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/)[1];
    if (remoteKey) {
      this.remoteKey = remoteKey;
      this.node[remoteKey] = this;
      console.log('[' + this.node.key + ']Connected to ' + this.remoteKey);
    } else {
      throw 'Connection Error';
    }
  }
};
