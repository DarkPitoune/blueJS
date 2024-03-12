const Ably = require("ably");

let ably;

async function initRealtimeServer() {
    ably = new Ably.Realtime(process.env.ABLY_TOKEN);
    await ably.connection.once("connected");
}

async function broadcastNewMessage(channelId, messageId) {
    const channel = ably.channels.get("messages");
    console.log(
        "Broadcasting new message",
        messageId,
        "on channel",
        channel.basePath
    );
    await channel.publish("new_message", { channelId, messageId });
}

module.exports = {
    initRealtimeServer,
    broadcastNewMessage,
};
