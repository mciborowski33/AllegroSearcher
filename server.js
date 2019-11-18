const http = require('http');
const https = require('https');
const fs = require('fs');
const socketio = require('socket.io');
const express = require('express');
const runner = require("child_process");
const app = express();

const port = 80;
app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(port, () => console.log(`App listening on port ${port}!`));

app.get("/allegroCode.html", function(request, response) {

    response.sendFile(__dirname + '/allegroCode.html');

    var phpScriptPath = "scripts/allegro_api.php";
    //var argsString = "value1,value2,value3";
    var argsString = "";
    runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
     if(err) console.log(err); /* log error */
    console.log( phpResponse );
    });

});
