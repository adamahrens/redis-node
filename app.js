var express = require('express');
var redis   = require("redis");
var config  = require('./config.js');
var client  = redis.createClient(config.port, config.host);
var pub     = redis.createClient(config.port, config.host);
var sub     = redis.createClient(config.port, config.host);
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

// io will know about all other Connections
// socket is simply one connection with one browser
io.on('connection', (socket) => {
  var now = Date.now();
  console.log('socket connection is open')

  if (now % 2 == 0) {
    console.log('joining even');
    socket.join('even');
  } else {
    console.log('joining odd');
    socket.join('odd');
  }

  // Whenever we get a socketping, send back a socketpong
  socket.on('socketping', () => {
    console.log('Got socketping. Sending socketpong');
    socket.emit('socketpong');
  });

  socket.on('name', (name) => {
    console.log(name + ' says hello');
    io.emit('name', name);
  });

  socket.on('room.join', (room) =>{
    console.log(socket.rooms);
    Object.keys(socket.rooms).filter((r) => r != socket.id).forEach((r) => socket.leave(r));

    setTimeout(() => {
      socket.join(room);
      socket.emit('event', 'Joined room ' + room);
      socket.broadcast.to(room).emit('event', 'Someone joined room ' + room);
    }, 0);

    socket.on('event', (e) => {
      socket.broadcast.to(e.room).emit('event', e.name + ' says good day!');
    });
  });

  io.to('even').emit('odd/even', 'Even Room: ' + now);
  io.to('odd').emit('odd/even', 'Odd Room: ' + now);

  setTimeout(() =>{
    io.to('even').emit('odd/even', 'Even Room: ' + now);
    io.to('odd').emit('odd/even', 'Odd Room: ' + now);
  }, 5000);
});

server.listen(3002);

client.set('redis_connections', '0');

// subscribe
sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
});

sub.on('event', function(channel, message) {
  console.log('Got event from ' + channel + ': ' + message);
});

sub.subscribe('requests');

client.on("error", function (err) {
    console.log("Error " + err);
});

/* Set Templating engine */
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  client.incr('redis_connections');
  client.get('redis_connections', function(err, reply) {
    response.render('home', { count: reply });
    console.log(reply);

    // Publish
    pub.publish('requests', 'Request on ' + request.socket.localPort + ' for url ' + request.url);
  });
});

app.get('*', function(request, response) {
    response.render('sorry');
});
