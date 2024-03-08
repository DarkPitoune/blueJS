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

const allMessages = [];
let lastId = 0;

const postMessage = (messageData) => {
    const newMessage = { id: lastId, ...messageData };
    allMessages.push(newMessage);
    lastId++;
    return newMessage;
};

const getMessage = (id) => {
    const message = allMessages.find((message) => message.id === id);
    if (!message) {
        throw new Error(`message with id ${id} not found`);
    }
    return message;
};

const getAllMessages = () => {
    return allMessages;
};

const getMessagesNumber = () => {
    return { count: allMessages.length };
};

const delMessage = (id) => {
    const index = allMessages.findIndex((message) => message.id === id);
    if (index === -1) {
        throw new Error(`message with id ${id} not found`);
    }
    allMessages.splice(index, 1);
};

module.exports = {
    postMessage,
    getMessage,
    getAllMessages,
    getMessagesNumber,
    delMessage,
    validateMessage,
};
