const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();

const mongoUri = require('./config/keys').mongoURI;
const { createConversation, deleteConversation, getAllConversations } = require('./controllers/conversationsController');
const { submitMutation } = require('./controllers/mutationsController');

const PORT = process.env.PORT || 4000;


// Express server
const app = express();

app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cors());
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/', (req, res) => {// Root React FE App
    res.sendFile('/frontend/build/index.html');
});
app.get('/ping', (req, res) => {
    res.json({
        "ok": true,
        "msg": "pong"
    })
})
app.get('/info', (req, res) => {
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
app.get('/conversations', (req, res) => getAllConversations(req, res))
app.post('/conversations', (req, res) => createConversation(req, res))
app.delete('/conversations', (req, res) => deleteConversation(req, res))
app.post('/mutations', (req, res) => submitMutation(req, res))


// const server = require('http').createServer(app);
// Socket.io instance
// const io = require("socket.io")(server);

// MongoDB
console.warn(`
    mongoUri is: ${mongoUri}
    `)
mongoose.connect(mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err))