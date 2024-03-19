const { broadcastNewMessage } = require("./realtime");

const validateMessage = (message) => {
    const content = message?.content;
    if (!content) throw new Error("content is required");

    const username = message?.username;
    if (!username) throw new Error("username is required");

    const date = message?.date;
    if (!date) throw new Error("date is required");

    const channel = message?.channel;
    if (!channel) throw new Error("channel is required");

    const photo = message?.photo;

    return { content, username, date, photo, channel };
};

const postMessage = async (db, messageData) => {
    const id = await db
        .execute({
            sql: "INSERT INTO messages (content, username, date, channel, photo) VALUES (?, ?, ?, ?, ?) RETURNING id",
            args: [
                messageData.content,
                messageData.username,
                messageData.date,
                messageData.channel,
                messageData.photo || "",
            ],
        })
        .then((res) => res.rows[0].id);

    await broadcastNewMessage(messageData.channel, id);

    return { id, ...messageData };
};

const getMessage = async (db, id) => {
    const message = await db
        .execute({
            sql: "SELECT * FROM messages WHERE id = ?",
            args: [id],
        })
        .then((res) => res.rows[0]);

    console.log(message);
    if (!message) {
        throw new Error(`message with id ${id} not found`);
    }
    return message;
};

const getAllMessages = (db) =>
    db.execute("SELECT * FROM messages").then((res) => res.rows);

const getChannelMessages = (db, id) =>
    db
        .execute({
            sql: "SELECT * FROM messages WHERE channel = ?",
            args: [id],
        })
        .then((res) => res.rows);

const getMessagesNumber = (db) =>
    db
        .execute("SELECT COUNT(*) AS nber FROM messages")
        .then((res) => res.rows[0].nber);

const delMessage = (db, id) =>
    db.execute({ sql: "DELETE FROM messages WHERE id = ?", args: [id] });

module.exports = {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    getChannelMessages,
    delMessage,
    validateMessage,
};
