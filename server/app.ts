const {
    postChannel,
    getAllChannels,
    validateChannel,
} = require("./channel.js");
import { TursoDatabaseService } from "./database";
import { MessageService } from "./message";
import { ChannelService } from "./channel";
//@ts-ignore
import { broadcastNewMessage } from "./websockets";

const tursoDatabaseService = new TursoDatabaseService();
const messageService = new MessageService(tursoDatabaseService);
const channelService = new ChannelService(tursoDatabaseService);

const express = require("express");
let app = express(); //instanciation d'une application Express

app.use(express.json());

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Definition of the different routes

app.get("/", function (req: any, res: any) {
    res.send("Hello");
});

app.post("/msg", (req: any, res: any) => {
    try {
        const newMessage = messageService.postMessage(req.body);
        broadcastNewMessage(newMessage.channel, newMessage.id);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }
});

// Must be placed before /msg/:id because it would match /msg/nber
app.get("/msg/nber", (req: any, res: any) => {
    res.status(200).json(messageService.getMessageNumber());
});

app.get("/msg/chn/:id", (req: any, res: any) => {
    if (!req.params.id) {
        res.status(400).send("id is req : anyuired");
        return;
    }
    const id = parseInt(req.params.id);
    const messages = messageService.getChannelMessages(id);
    res.status(200).json(messages);
});

app.get("/msg/:id", (req: any, res: any) => {
    if (!req.params.id) {
        res.status(400).send("id is req : anyuired");
        return;
    }
    try {
        const id = parseInt(req.params.id);
        const message = messageService.getMessage(id);
        res.status(200).json(message);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/msg", (req: any, res: any) => {
    const allMessages = messageService.getAllMessages();
    return res.status(200).json(allMessages);
});

app.delete("/msg/:id", (req: any, res: any) => {
    if (!req.params.id) {
        res.status(400).send("id is req : anyuired");
        return;
    }
    try {
        const id = parseInt(req.params.id);
        messageService.deleteMessage(id);
        res.status(200).send();
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/chn", (req: any, res: any) => {
    const allChannels = channelService.getAllChannels();
    return res.status(200).json(allChannels);
});

app.post("/chn", (req: any, res: any) => {
    try {
        const newChannel = channelService.postChannel(req.body);
        res.status(201).json(newChannel);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }
});

app.listen(8888); //commence à accepter les req : anyuêtes
console.log("App listening on port 8888...");
