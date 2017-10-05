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
    console.log(`${connections.length} active connections...`);
});