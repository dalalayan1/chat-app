const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io').listen(server).sockets;
const mongo = require('mongodb').MongoClient();

let users = [];
let connections = [];
let port = process.env.PORT || 8001;

mongo.connect('mongodb://127.0.0.1/mongochat', (err, db) => {
    if( err ) throw err;

    console.log('mongodb connected...');

    socketIO.on('connection', (socket) => {

        let chats = db.collection('chats');
        connections.push(socket);
        console.log(`connection added : ${connections.length} active connections...`);

        chats.find().sort({_id:1}).toArray( (err, res) => {
            if( err ) throw err;

            socket.emit('new message', res);
        })

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
    
        socket.on('send message', (data) => {
            let { name } = data;
            let { msg } = data;

            if(name === '' || msg === '') {
                return socket.emit('status', 'Please enter name & msg!');
            }

            chats.insert({name: name, msg: msg}, () => {
                socketIO.emit('new message', [data]);
                socket.emit('status', 'Message sent!');
            });
        });
    
        updateOnlineUsers = () => {
            socketIO.emit('add user', users);
        }
    });
});

server.listen(port, () => console.log(`server running on ${port} port`));

app.use('/', express.static(path.join(__dirname, 'files')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});