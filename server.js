const http = require('http');
const https = require('https');
const fs = require('fs');
const io = require('socket.io');
const express = require('express');
const runner = require("child_process");
const app = express();

const port = 80;
app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(port, () => console.log(`App listening on port ${port}!`));

function allegroApi(mode, data){

    var phpScriptPath = "scripts/allegro_api.php";
    //var argsString = "value1,value2,value3";
    var argsString = "";
    runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
     if(err) console.log(err); /* log error */
    console.log( phpResponse );
    });

}

io.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });

  socket.on('receive Data to search', function (data) {
    console.log(data);
    // allegroApi( 1, data )
  });

});
