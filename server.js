const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');
const express = require('express');
const app = express();

const port = 80;
app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(port, () => console.log(`App listening on port ${port}!`));

app.get("/allegro", function(request, response) {
  var proxyRequest = http.request({
      host: "https://allegro.pl.allegrosandbox.pl/auth/oauth/token?grant_type=client_credentials",
      port: 8000,
      method: 'GET',
      path: '/',
      username: 'a16004d41096431198bc9baf3d58aa0c',
      password: 'ADTNwyWVNJKQ8YpJR4G4svF0mAA0aosD8FnNzcqgsRvquLU9X4fPdVczPjSvJBwq'
    },
    function (proxyResponse) {
      proxyResponse.on('data', function (chunk) {
        //response.send(chunk);
        alert(chunk);
      });
    });

  //proxyRequest.write(response.body);
  //proxyRequest.end();
});
