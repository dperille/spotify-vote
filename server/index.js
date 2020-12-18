const Queue = require('../app/components/queue.js');

var app = require("express")();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var queue = new Queue();

io.on('connection', function(socket) {
  console.log('socket id ' + socket.id + ' connected');

  socket.emit('new-queue', queue.queue);

  socket.on('add-song', function(title, artist, votes){
    queue.addSong(title, artist, votes);
    io.emit('new-queue', queue.queue);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log('listening on port: ' + port);
});
