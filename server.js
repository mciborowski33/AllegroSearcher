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
