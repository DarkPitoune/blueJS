const Ably = require("ably");

let ably;

async function initRealtimeServer() {
    ably = new Ably.Realtime(process.env.ABLY_TOKEN);
    ably.connection.once("connected", () => {
        console.log("Connected to Ably");
    });
}

const broadcastNewMessage = (channelId, messageId) => {
    const channel = ably.channels.get("messages");
    console.log("Broadcasting new message", messageId);
    channel.publish("new_message", { channelId, messageId });
};

module.exports = {
    initRealtimeServer,
    broadcastNewMessage,
};
