const {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    delMessage,
    validateMessage,
} = require("./message.js");
require("dotenv").config();

const express = require("express");
let app = express(); //instanciation d'une application Express
const Database = require("libsql");

app.use(express.json());

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_TOKEN;
if (!url || !authToken)
    throw Error("TURSO_URL and TURSO_TOKEN must be set in environment");

const db = new Database(url, { authToken });

function initDb() {
    db.exec(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  date TEXT NOT NULL,
  photo TEXT
  );`);
}
// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
});

// Definition of the different routes

app.get("/", function (req, res) {
    res.send("Hello");
});

app.post("/msg", (req, res) => {
    let messageData;
    try {
        messageData = validateMessage(req.body);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }

    try {
        const newMessage = postMessage(db, messageData);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Must be placed before /msg/:id
app.get("/msg/nber", (req, res) => {
    res.status(200).json(getMessagesNumber(db));
});

app.get("/msg/:id", (req, res) => {
    if (!req.params.id) {
        res.status(400).send("id is required");
        return;
    }
    try {
        const id = parseInt(req.params.id);
        const message = getMessage(db, id);
        res.status(200).json(message);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/msg", (req, res) => {
    const allMessages = getAllMessages(db);
    return res.status(200).json(allMessages);
});

app.delete("/msg/:id", (req, res) => {
    if (!req.params.id) {
        res.status(400).send("id is required");
        return;
    }
    try {
        const id = parseInt(req.params.id);
        delMessage(db, id);
        res.status(200).json(message);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

initDb();
app.listen(8888); //commence à accepter les requêtes
console.log("App listening on port 8888...");
