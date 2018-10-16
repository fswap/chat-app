const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

var {generateMessage}=require('./utils/message');


const publicpath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicpath));

io.on('connection',(socket)=>{
    console.log('New User Connected');


    socket.on('createEmail',(newEmail)=>{
        console.log('createEmail',newEmail);
    });

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('This is from server');
        /*
        socket.broadcast.emit('newMessage',{
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
        });*/
    });

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});


server.listen(port,()=>{
    console.log(`Server is on port ${port}`);
});