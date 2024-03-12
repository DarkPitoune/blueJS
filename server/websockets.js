const ws = require("ws");

const wsServer = new ws.Server({ noServer: true });

const sockets = [];

wsServer.on("connection", (socket) => {
    sockets.push(socket);
    console.log("New connection, total: ", sockets.length);

    socket.on("close", () => {
        sockets.splice(sockets.indexOf(socket), 1);
        console.log("Connection closed, total: ", sockets.length);
    });
});

exports.broadcastNewMessage = (channelId, messageId) => {
    console.log(`Broadcasting new message to ${sockets.length} clients`);
    sockets.forEach((socket) => {
        socket.send(JSON.stringify({ channelId, messageId }));
    });
};

exports.wsServer = wsServer;
