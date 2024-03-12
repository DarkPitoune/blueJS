const validateChannel = (channelData) => {
    if (!channelData.name) {
        throw new Error("name is required");
    }
    return { name: channelData.name };
};

const getAllChannels = (db) => db.prepare("SELECT * FROM channels").all();

const postChannel = (db, channelData) => {
    db.prepare("INSERT INTO channels (name) VALUES (?)").run(channelData.name);
    return {
        id: db.prepare("SELECT last_insert_rowid() as id").get().id,
        ...channelData,
    };
};

module.exports = {
    getAllChannels,
    validateChannel,
    postChannel,
};
