const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('set username', (username) => {
    users.push({ id: socket.id, username });
    io.emit('users', users);
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('users', users);
    console.log('User disconnected');
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', { user: data.user, msg: data.msg });
  });
});

app.use(express.static(path.join(__dirname, '..', 'chat-app', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'chat-app', 'build', 'index.html'));
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
