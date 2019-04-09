var express = require('express');
var redis   = require("redis");
var config  = require('./config.js');
var client  = redis.createClient(config.port, config.host);
var pub     = redis.createClient(config.port, config.host);
var sub     = redis.createClient(config.port, config.host);
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('socket connection is open')

  // Whenever we get a socketping, send back a socketpong
  socket.on('socketping', () => {
    console.log('Got socketping. Sending socketpong');
    socket.emit('socketpong');
  });
});
server.listen(3000);

client.set('redis_connections', '0');

// subscribe
sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
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
