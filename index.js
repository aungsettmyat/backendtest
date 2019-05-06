const port=process.env.PORT || 3000
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(port, function(){
	console.log('Server Running!!!....');
});

app.use(express.static('public'));

var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    socket.on('play', function(data){
    	io.sockets.emit('play', data);
	});

    socket.on('pause', function(data){
        io.sockets.emit('pause', data);
    });
    
    socket.on('videoid', function(data){
        io.sockets.emit('videoid', data);
    });
});