const express = require("express");
const path = require('path');
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/keys').mongoURI;
const { getAllConversations } = require('./controllers/conversationsController');
const index = require('./routes/index');

// const User = require('./models/User');
// const Game = require('./models/Game');

// Static port needed to ensure React frontend can connect to Socket.io when deployed
const ioPort = 4797;
const PORT = process.env.PORT || 4000;


// Express server
const app = express()
    .use(express.static(path.join(__dirname, '../frontend/build')))
    .get('/', (req, res) => {// Root React FE App
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    })
    .get('/ping', (req, res) => {
        res.json({
            "ok": true,
            "msg": "pong"
        })
    })
    .get('/info', (req, res) => {
        res.json({
            "ok": true,
            "author": {
                "email": "olozzalap@gmail.com",
                "name": "Eben Palazzolo"
            },
            "frontend": {
                "url": "string, the url of your frontend."
            },
            "language": "BE: Node | FE: React",
            "sources": "https://github.com/olozzalap/collaborative-realtime-transcripts",
            "answers": {
                "1": "string, answer to the question 1",
                "2": "string, answer to the question 2",
                "3": "string, answer to the question 3"
            }
        })
    })
    .get('/conversations', (req, res) => getAllConversations(req, res))


const server = require('http').createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// Socket.io instance
const io = require("socket.io")(server);

// MongoDB
