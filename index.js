const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('set nickname', (nickname) => {
        socket.nickname = nickname;
        users[socket.id] = nickname;
        io.emit('user list', Object.values(users));
        io.emit('chat message', `${nickname} has joined the chat`);
        console.log(`${nickname} has joined the chat`);
    });

    socket.on('disconnect', () => {
        if (socket.nickname) {
            io.emit('chat message', `${socket.nickname} has left the chat`);
            console.log(`${socket.nickname} has left the chat`);
            delete users[socket.id];
            io.emit('user list', Object.values(users));
        } else {
            io.emit('chat message', 'A user has disconnected');
            console.log('A user has disconnected');
        }
    });

    socket.on('chat message', (msg) => {
        const message = `${socket.nickname || 'Anonymous'}: ${msg}`;
        io.emit('chat message', message);
        console.log(message);
    });

    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', { user: socket.nickname, isTyping });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});