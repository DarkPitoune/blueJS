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

const postMessage = (db, messageData) => {
    db.prepare(
        "INSERT INTO messages (content, username, date, channel, photo) VALUES (?, ?, ?, ?, ?)"
    ).get(
        messageData.content,
        messageData.username,
        messageData.date,
        messageData.channel,
        messageData.photo
    );
    return {
        id: db.prepare("SELECT last_insert_rowid() as id").get().id,
        ...messageData,
    };
};

const getMessage = (db, id) => {
    const message = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
    if (!message) {
        throw new Error(`message with id ${id} not found`);
    }
    return message;
};

const getAllMessages = (db) => db.prepare("SELECT * FROM messages").all();

const getChannelMessages = (db, id) =>
    db.prepare("SELECT * FROM messages WHERE channel = ?").all(id);

const getMessagesNumber = (db) =>
    db.prepare("SELECT COUNT(*) AS nber FROM messages").get().nber;

const delMessage = (db, id) =>
    db.prepare("DELETE FROM messages WHERE id = ?").run(id);

module.exports = {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    getChannelMessages,
    delMessage,
    validateMessage,
};
