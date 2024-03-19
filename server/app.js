const {
    postMessage,
    getMessage,
    getAllMessages,
    getChannelMessages,
    getMessagesNumber,
    delMessage,
    validateMessage,
} = require("./message.js");
const {
    postChannel,
    getAllChannels,
    validateChannel,
} = require("./channel.js");
require("dotenv").config();
const Ably = require("ably");

const express = require("express");
let app = express(); //instanciation d'une application Express
const { createClient } = require("@libsql/client");
const { initRealtimeServer } = require("./realtime.js");

app.use(express.json());

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_TOKEN;
if (!url || !authToken)
    throw Error("TURSO_URL and TURSO_TOKEN must be set in environment");

async function initDb() {
    const db = createClient({ url, authToken });
    await db.execute(`CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    );`);
    db.execute(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  date TEXT NOT NULL,
  photo TEXT,
    channel INTEGER NOT NULL,
    FOREIGN KEY (channel) REFERENCES channels(id)
  );`);
}

if (process.env.NODE_ENV === "development") {
    app.use("/", express.static("../client"));
}

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    const db = createClient({ url, authToken });
    req.db = db;
    next();
});

// Definition of the different routes
app.post("/msg", async (req, res) => {
    let messageData;
    try {
        messageData = validateMessage(req.body);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }

    try {
        const newMessage = await postMessage(req.db, messageData);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Must be placed before /msg/:id because it would match /msg/nber
app.get("/msg/nber", (req, res) => {
    res.status(200).json(getMessagesNumber(req.db));
});

app.get("/msg/chn/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).send("id is required");
        return;
    }
    const id = parseInt(req.params.id);
    const messages = await getChannelMessages(req.db, id);
    res.status(200).json(messages);
});

app.get("/msg/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).send("id is required");
        return;
    }
    try {
        const id = parseInt(req.params.id);
        const message = await getMessage(req.db, id);
        res.status(200).json(message);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/msg", async (req, res) => {
    const allMessages = await getAllMessages(req.db);
    return res.status(200).json(allMessages);
});

app.delete("/msg/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).send("id is required");
        return;
    }
    try {
        const id = parseInt(req.params.id);
        await delMessage(req.db, id);
        res.status(200).send("Message deleted");
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/chn", async (req, res) => {
    const allChannels = await getAllChannels(req.db);
    return res.status(200).json(allChannels);
});

app.post("/chn", async (req, res) => {
    let channelData;
    try {
        channelData = validateChannel(req.body);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }
    try {
        const newChannel = await postChannel(req.db, channelData);
        res.status(201).json(newChannel);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/rt/subscribe", async (req, res) => {
    try {
        const ably = new Ably.Rest({ key: process.env.ABLY_TOKEN });
        ably.auth.createTokenRequest({}, null, (err, tokenRequest) => {
            res.status(200).json(tokenRequest);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

initDb();
initRealtimeServer();
app.listen(8888); //commence à accepter les requêtes
console.log("App listening on port 8888...");
