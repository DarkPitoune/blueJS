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

const postMessage = (messageData) => {
    return "postMessage";
};

const getMessage = (req, res) => {
    res.send("getMessage");
};

const getAllMessages = (req, res) => {
    res.send("getAllMessages");
};

const getMessagesNumber = (req, res) => {
    res.send("getMessagesNumber");
};

const delMessage = (req, res) => {
    res.send("delMessage");
};

module.exports = {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    delMessage,
    validateMessage,
};
