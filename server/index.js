const RoomTracker = require('./room_track.js');

var app = require("express")();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// tracks used and unused rooms, including tracking their song queues
var roomTracker = new RoomTracker();

io.on('connection', function(socket) {
  console.log('socket id ' + socket.id + ' connected');

  
  // when client adds a song to the queue
  socket.on('add-song', function(title, artist, votes){
    const roomId = socket.roomsIn[0];

    // add the song to the priority queue
    roomTracker.addSong(roomId, title, artist, votes);

    // notify all clients of the new queue
    io.to(roomId).emit('new-queue', roomTracker.getQueueAsArr(roomId));
  });


  // client votes up a song in the queue
  socket.on('vote-up', function(listId){
    const roomId = socket.roomsIn[0];

    var voteCount = roomTracker.voteUpSong(roomId, listId);

    // Emit the new queue ordering and element's vote count
    io.to(roomId).emit('new-queue', roomTracker.getQueueAsArr(roomId));
    io.to(roomId).emit('vote-up', listId, voteCount);
  });


  // client votes down a song in the queue
  socket.on('vote-down', function(listId){
    const roomId = socket.roomsIn[0];
    
    var voteCount = roomTracker.voteDownSong(roomId, listId);

    // Emit the new queue ordering and element's vote count
    io.to(roomId).emit('new-queue', roomTracker.getQueueAsArr(roomId));
    io.to(roomId).emit('vote-down', listId, voteCount);
  });


  // after choosing host, user requests a room
  socket.on('get-room', function(){
    // get empty room
    var roomId = roomTracker.getEmptyRoom();

    // no empty rooms left
    if(roomId == null){
      socket.emit('give-room', null);
    }

    // send room ID back to requester
    socket.join(roomId);
    socket.roomsIn = [roomId];
    socket.emit('give-room', roomId);
  });


  // client requesting to join room, ensure valid ID and join
  socket.on('join-room', function(roomId){
    // valid roomId -- join
    if(roomTracker.isValidRoomId(roomId)){
      socket.join(roomId);
      socket.roomsIn = [roomId];

      // give client the existing queue and signal success of join
      socket.emit('join-room', true);
      socket.emit('new-queue', roomTracker.getQueueAsArr(roomId));
    }

    // invalid id -- signal error
    else{
      socket.emit('join-room', false);
    }
  });

});

server.listen(port, '0.0.0.0', () => {
  console.log('listening on port: ' + port);
});
