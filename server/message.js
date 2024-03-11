const validateMessage = (message) => {
    const content = message?.content;

    if (!content) {
        throw new Error("content is required");
    }

    const username = message?.username;
    if (!username) {
        throw new Error("username is required");
    }
    const date = message?.date;
    if (!date) {
        throw new Error("date is required");
    }
    const photo = message?.photo;

    return { content, username, date, photo };
};

const postMessage = (db, messageData) => {
    db.prepare(
        "INSERT INTO messages (content, username, date, photo) VALUES (?, ?, ?, ?)",
    ).get(
        messageData.content,
        messageData.username,
        messageData.date,
        messageData.photo,
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

const getAllMessages = (db) => {
    return db.prepare("SELECT * FROM messages").all();
};

const getMessagesNumber = (db) => {
    return db.prepare("SELECT COUNT(*) AS nber FROM messages").get().nber;
};

const delMessage = (db, id) => {
    db.prepare("DELETE FROM messages WHERE id = ?").run(id);
};

module.exports = {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    delMessage,
    validateMessage,
};
