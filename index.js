const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('chat message', 'A user has connected');

  socket.on('disconnect', () => {
      console.log('user disconnected');
      io.emit('chat message', 'A user has disconnected');
  });

  socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});