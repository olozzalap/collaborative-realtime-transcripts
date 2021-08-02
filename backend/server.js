const express = require("express");
const path = require('path');
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const index = require("./routes/index");
require('dotenv').config();
const PORT = process.env.PORT || 4000;
// Static port needed to ensure React frontend can connect to Socket.io when deployed
const ioPort = 4797;
const db = require('./config/keys').mongoURI;
// const User = require('./models/User');
// const Game = require('./models/Game');



// Express server
console.warn(`
    __dirname is: ${__dirname}
    path.join(__dirname, '../frontend/build') is: ${path.join(__dirname, '../frontend/build')}
    path.join(__dirname, '../frontend/build/index.html') is: ${path.join(__dirname, '../frontend/build/index.html')}
    `)
const app = express()
    .use(express.static(path.join(__dirname, '../frontend/build')))
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    })

const server = require('http').createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// Socket.io instance
const io = require("socket.io")(server);

// MongoDB
