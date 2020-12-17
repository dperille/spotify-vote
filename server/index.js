var app = require("express")();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('socket id ' + socket.id + ' connected');

    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });

server.listen(port, () => {
    console.log('listening on port: ' + port);
});
