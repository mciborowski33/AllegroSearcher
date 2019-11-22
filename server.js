const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const runner = require("child_process");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 80;
app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
server.listen(port, function(){
    console.log(`App listening on port ${port}!`);
    init()
});

let accessToken = "0";

function init(){
    allegroApi(1, "0");
    //console.log(accessToken);
    setInterval(function(){ allegroApi(1, "0"); }, 43200000);
}

function setAccessToken(newToken){
    //console.log("New Token: " + newToken);
    accessToken = JSON.parse(newToken).access_token;
}

function allegroApi(mode = "0", data = "0"){

    console.log(mode);
    var phpScriptPath = "scripts/allegro_api.php";
    //var argsString = "value1,value2,value3";
    var argsString = mode + " " + accessToken + " " + data;
    console.log(argsString);
    runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
        if(err) console.log(err); /* log error */
            //console.log( phpResponse );
            //return phpResponse.toString();
            if( mode == "1" )
                setAccessToken(phpResponse);
    });

}

io.on('connection', function (socket) {

    socket.emit('token', { token: accessToken });

    socket.on('receive Data to search', function (data) {
        console.log(data);
        // allegroApi( 2, data )
    });

});
