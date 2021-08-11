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
    res.sendFile('/app/frontend/build/index.html');
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
            "url": "https://pacific-headland-95504.herokuapp.com/"
        },
        "language": "BE: Node | FE: React",
        "sources": "https://github.com/olozzalap/collaborative-realtime-transcripts",
        "answers": {
            "1": "My approach was broadly to tackle the greatest complexity first which revolved around working through the BE transformation data logic first, then moving to put together the FE and tyhen using both to iterate, test and improve! I focused on clean code and performance throughout as well as managing the complexity of all the states in text input and manipulation.",
            "2": "Websocket or Socket.io full duplex communication to actively push updates from other users into other transcripts live and visualize the changes as they happen.",
            "3": "This is an insanely detailed challenge, especially given the spec and details really expect a very thorough solution. I think this needs to be rethought and massively lowered in Scope as this is far too much Engineering for a short take-home."
        }
    })
})
app.get('/conversations', (req, res) => getAllConversations(req, res))
app.post('/conversations', (req, res) => createConversation(req, res))
app.delete('/conversations', (req, res) => deleteConversation(req, res))
app.post('/mutations', (req, res) => submitMutation(req, res))


// MongoDB
mongoose.connect(mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err))