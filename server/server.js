const path = require('path');
const http = require('http');
const express = require('express');
const exp = require('express');
const socketIO = require('socket.io');
const csock = require('socket.io');

var {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');

const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');

const publicpath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users=new Users();

app.use(express.static(publicpath));

io.on('connection', (socket) => {
    console.log('New User Connected');


    socket.on('createEmail', (newEmail) => {
        console.log('createEmail', newEmail);
    });

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name and Group name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user=users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback('This is from server');

        socket.on('createLocationMessage', (coords) => {
            var user=users.getUser(socket.id);
            if(user){
                io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
            }
            
        })
    });

    socket.on('disconnect', () => {
       var user=users.removeUser(socket.id);

       if(user){
           io.to(user.room).emit('updateUserList',users.getUserList(user.room));
           io.to(user.room).emit('newMessage',generateMessage(`${user.name} has left`));
       }
    });
});


server.listen(port, () => {
    console.log(`Server is on port ${port}`);
});
