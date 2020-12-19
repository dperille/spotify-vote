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
    // add the song to the priority queue
    queue.addSong(title, artist, votes);

    // notify all clients of the new queue
    io.emit('new-queue', queue.queue);
  });

  socket.on('vote-up', function(listId){
    var voteCount = queue.voteUp(listId);

    // Emit the new queue ordering and element's vote count
    io.emit('new-queue', queue.queue);
    io.emit('vote-up', listId, voteCount);
  });

  socket.on('vote-down', function(listId){
    var voteCount = queue.voteDown(listId);

    // Emit the new queue ordering and element's vote count
    io.emit('new-queue', queue.queue);
    io.emit('vote-down', listId, voteCount);
  });

});

server.listen(port, '0.0.0.0', () => {
  console.log('listening on port: ' + port);
});
