const {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    delMessage,
    validateMessage,
} = require("./message.js");

const express = require("express");
let app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
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
    }

    try {
        const newMessage = postMessage(messageData);
        res.status(201).send(newMessage);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/msg/:id", (req, res) => {
    getMessage(req, res);
});
app.get("/msg", (req, res) => {
    getAllMessages(req, res);
});
app.get("/msg/nber", (req, res) => {
    getMessagesNumber(req, res);
});
app.delete("/msg/:id", (req, res) => {
    delMessage(req, res);
});

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");
