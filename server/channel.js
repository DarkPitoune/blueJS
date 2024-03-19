const validateChannel = (channelData) => {
    if (!channelData.name) {
        throw new Error("name is required");
    }
    return { name: channelData.name };
};

const getAllChannels = (db) =>
    db.execute("SELECT * FROM channels").then((res) => res.rows);

const postChannel = (db, channelData) => {
    const { rows } = db.execute({
        sql: "INSERT INTO channels (name) VALUES (?) RETURNING id",
        args: [channelData.name],
    });
    return {
        id: rows[0].id,
        ...channelData,
    };
};

module.exports = {
    getAllChannels,
    validateChannel,
    postChannel,
};
