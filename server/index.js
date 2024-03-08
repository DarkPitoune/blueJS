import {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    delMessage,
} from "./message.js";

import express from "express";
//var express = require("express"); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

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

app.post("/msg/post/:msg", (req, res) => {
    postMessage(req, res);
});
app.get("/msg/get/:id", (req, res) => {
    getMessage(req, res);
});
app.get("/msg/getAll", (req, res) => {
    getAllMessages(req, res);
});
app.get("/msg/nber", (req, res) => {
    getMessagesNumber(req, res);
});
app.get("/msg/del/:id", (req, res) => {
    delMessage(req, res);
});

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");
