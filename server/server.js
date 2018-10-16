const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

const publicpath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicpath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.emit('newEmail',{
        from:'gaurav@example.com',
        text:'Hi sukhhu kaise ho',
        createdAt:123
    });

    socket.emit('newMessage',{
            from:'GAURAV',
            text:'Good Morningggggggg...... MUMBAI',
            createdAt:123123
    });

    socket.on('createEmail',(newEmail)=>{
        console.log('createEmail',newEmail);
    });

    socket.on('createMessage',(message)=>{
        console.log('createMessage',message);
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});


server.listen(port,()=>{
    console.log(`Server is on port ${port}`);
});