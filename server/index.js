var app = require("express")();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('socket id ' + socket.id + ' connected');

  socket.on('message', function(msg){
    io.emit('message', msg);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log('listening on port: ' + port);
});
