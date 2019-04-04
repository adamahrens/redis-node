var express = require('express');
var redis   = require("redis");
var config  = require('./config.js');
var client  = redis.createClient(config.port, config.host);
var app     = express();

client.set('redis_connections', '0');

client.on("error", function (err) {
    console.log("Error " + err);
});

/* Set Templating engine */
app.set('view engine', 'ejs');

app.get('/', function(request, response){
  client.incr('redis_connections');
  client.get('redis_connections', function(err, reply) {
    response.render('home', { count: reply });
    console.log(reply);
  });
});

app.get('*', function(request, response) {
    response.render('sorry');
});

app.listen(3001, function() {
  console.log('Server listening on 3001');
});
