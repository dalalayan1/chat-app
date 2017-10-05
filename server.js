const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io').listen(server);

let users = [];
let connections = [];
let port = process.env.PORT || 8001;

server.listen(port, () => console.log(`server running on ${port} port`));

app.use('/', express.static(path.join(__dirname, 'files')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

socketIO.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(`connection added : ${connections.length} active connections...`);

    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.username), 1);
        updateOnlineUsers();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`connection removed : ${connections.length} active connections...`);
    });

    socket.on('new user', (newUser) => {
        users.push(newUser);
        console.log(users)
        socket.username = newUser;
        updateOnlineUsers();
    });

    socket.on('send message', (newMessage) => {
        socketIO.sockets.emit('new message', {user: socket.username, msg: newMessage});
    });

    updateOnlineUsers = () => {
        socketIO.sockets.emit('add user', users);
    }
});