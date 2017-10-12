const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io').listen(server).sockets;
const request = require('request');

let users = [];
let connections = [];
let port = process.env.PORT || 8001;

let db = 'chats',
    collection = 'chat-msgs',
    apiKey = 'uqqEctpkJziPyUmQJ_McM7Bers0p3rlH',
    url = `https://api.mlab.com/api/1/databases/${db}/collections/${collection}?apiKey=${apiKey}`;

const loadDoc = (socket) => {
    let res;
    request(url, (error, response, body) => {
        if (error) throw new error;
        else if (!error && response.statusCode == 200) {
            socket.emit('new message', body);
        }
        else {
            console.log('Bad API ',response.statusCode);
            return null;
        }
        return res;
    })
}


socketIO.on('connection', (socket) => {
    connections.push(socket);
    console.log(`connection added : ${connections.length} active connections...`);

    loadDoc(socket);

    socket.on('disconnect', () => {
        users = users.find((user, i) => {
            return user.id === socket.userDetails.id;
        });
        updateOnlineUsers();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`connection removed : ${connections.length} active connections...`);
    });

    socket.on('new user', (newUser) => {
        users.push(newUser);
        console.log(users)
        socket.userDetails = newUser;
        updateOnlineUsers();
    });

    socket.on('send message', (data) => {
        let { details } = data;
        let { msg } = data;

        if(details === '' || msg === '') {
            return socket.emit('status', 'Please enter name & msg!');
        }

        request.post({
            url: url, 
            body: data,
            json: true
        }, (err, response, body) => {
            if (err) throw err;
            socketIO.emit('new message', JSON.stringify([body]));
            console.log(body);
        });
    });

    updateOnlineUsers = () => {
        socketIO.emit('add user', users);
    }
});

server.listen(port, () => console.log(`server running on ${port} port`));

app.use('/', express.static(path.join(__dirname, 'files')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});