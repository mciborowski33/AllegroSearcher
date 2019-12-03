const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const runner = require("child_process");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const request = require('request');

const port = 80;
app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
server.listen(port, function(){
    console.log(`App listening on port ${port}!`);
});

const client_id = "fb6c73e8e50b480f8c27019029f48c0f";
const client_secret = 'OsucPMjJHv9rMNSm3fJwORUfjASJ3sEUO9u6MIyVkxB2RwZ4WcQlHC0fYZ1Za51d';
let device_code = 'jwxVGIxGv3iKfjppiszY6wZLw4NK4itW';
let access_token = '';

app.get('/allegrotest', function(req, res){

    let options = {
      url: 'https://allegro.pl/auth/oauth/token?grant_type=client_credentials',
      headers: {
          'Authorization': 'Basic ' + Buffer.from(client_id+':'+client_secret).toString('base64')
          //'Content-Type': 'application/x-www-form-urlencoded'
      },
    };

    request.post(options, callback);

    function callback(error, response, body){
        console.log(body);
        access_token = JSON.parse(body).access_token;
        console.log(access_token);

        let options2 = {
          url: 'https://api.allegro.pl/offers/listing?phrase=t-shirt&price.from=10&price.to=100&order=d',
          headers: {
              'Authorization': 'Bearer ' + access_token,
              'Accept': 'application/vnd.allegro.public.v1+json'
              //'Content-Type': 'application/x-www-form-urlencoded'
          },
        };
                request.get(options2, function(error, response, body){
                    console.log(body);
                });
    }
});
