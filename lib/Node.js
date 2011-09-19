// P2PSocket

var net = require('net');
var uuid = require('node-uuid');

var Connection = require('./Connection');

var Node = module.exports = function(args) {
  this.port = args.port;
  this.connections = {};
  this.key = uuid();
  
  this.server = net.createServer(function(socket) {
    new Connection({node: this,
                    socket: socket});
  }.bind(this));
  this.server.listen(this.port);
};

Object.defineProperty(Node.prototype, 'connect', {value: function(host, port, callback) {
  var socket = net.createConnection(port, host);
  socket.on('connect', function() {
    new Connection({node:   this,
                    socket: socket});
  }.bind(this));
}});
