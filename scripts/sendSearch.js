var socket = io.connect('http://localhost');

    socket.on('token', function (data) {
        console.log(data);
        //socket.emit('test', { my: 'data' });
    });

    function sendSearch(data){
        console.log(data);
        //var tmp = data.toString().replace(/\"/g, '/');
        socket.emit('searchData', data);
    }
