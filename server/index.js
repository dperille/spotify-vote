const Queue = require('../app/components/queue.js');

var app = require("express")();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// queue of songs
var queue = new Queue();

// list rooms
var roomsAvailable = ['0000', '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009'];
var roomsUsed = [];

io.on('connection', function(socket) {
  console.log('socket id ' + socket.id + ' connected');

  // give the new client the existing queue
  // TODO -- store queue per room
  socket.emit('new-queue', queue.queue);

  socket.on('add-song', function(title, artist, votes){
    // add the song to the priority queue
    queue.addSong(title, artist, votes);

    // notify all clients of the new queue
    io.to(socket.roomsIn[0]).emit('new-queue', queue.queue);
  });

  socket.on('vote-up', function(listId){
    var voteCount = queue.voteUp(listId);

    // Emit the new queue ordering and element's vote count
    io.to(socket.roomsIn[0]).emit('new-queue', queue.queue);
    io.to(socket.roomsIn[0]).emit('vote-up', listId, voteCount);
  });

  socket.on('vote-down', function(listId){
    var voteCount = queue.voteDown(listId);

    // Emit the new queue ordering and element's vote count
    io.to(socket.roomsIn[0]).emit('new-queue', queue.queue);
    io.to(socket.roomsIn[0]).emit('vote-down', listId, voteCount);
  });

  // after choosing host, user requests a room
  socket.on('get-room', function(){
    // error if no open rooms
    if(roomsAvailable.length == 0){
      socket.emit('give-room', null);
    }

    // get available ID and add to taken list
    var roomId = roomsAvailable.splice(0, 1)[0];
    roomsUsed.push(roomId);

    // send room ID back to requester
    socket.join(roomId);
    socket.roomsIn = [roomId];
    socket.emit('give-room', roomId);
  });

  // client requesting to join room, ensure valid ID and join
  socket.on('check-room-number', function(roomId){
    // valid roomId -- join
    if(roomsUsed.includes(roomId)){
      socket.join(roomId);
      socket.roomsIn = [roomId];
      socket.emit('check-room-number', true);
    }

    // invalid id -- signal error
    else{
      socket.emit('check-room-number', false);
    }
  });

});

server.listen(port, '0.0.0.0', () => {
  console.log('listening on port: ' + port);
});
