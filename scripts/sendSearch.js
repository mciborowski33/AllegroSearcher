var socket = io.connect('http://localhost');
    socket.on('token', function (data) {
    console.log(data);
    //socket.emit('test', { my: 'data' });
});
