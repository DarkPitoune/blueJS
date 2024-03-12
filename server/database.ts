import Database from "libsql";
import { MessageEntity, ChannelEntity } from "./entities";
import { MessageDto, ChannelDto } from "./dto";
import dotenv from "dotenv";

dotenv.config();

export interface IDatabaseService {
    insertMessage: (messageData: MessageDto) => number;
    getMessage: (messageId: number) => MessageEntity;
    getAllMessages: () => Array<MessageEntity>;
    getChannelMessages: (channelId: number) => Array<MessageEntity>;
    getMessageNumber: () => number;
    deleteMessage: (messagId: number) => void;
    getAllChannels: () => Array<ChannelEntity>;
    insertChannel: (channelData: ChannelDto) => number;
}

export class TursoDatabaseService implements IDatabaseService {
    db: any;

    constructor() {
        const url = process.env.TURSO_URL;
        const authToken = process.env.TURSO_TOKEN;
        if (!url || !authToken)
            throw Error("TURSO_URL and TURSO_TOKEN must be set in environment");

        //@ts-ignore
        this.db = new Database(url, { authToken });
        this.initDatabase();
    }

    initDatabase = () => {
        this.db.exec(`CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    );`);
        this.db.exec(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  date TEXT NOT NULL,
  photo TEXT,
    channel INTEGER NOT NULL,
    FOREIGN KEY (channel) REFERENCES channels(id)
  );`);
    };

    insertMessage = (messageData: MessageDto): number => {
        this.db
            .prepare(
                "INSERT INTO messages (content, username, date, channel, photo) VALUES (?, ?, ?, ?, ?)"
            )
            .get(
                messageData.content,
                messageData.username,
                messageData.date,
                messageData.channel,
                messageData.photo
            );
        return this.db.prepare("SELECT last_insert_rowid() as id").get().id;
    };

    getMessage = (messageId: number): MessageEntity =>
        this.db.prepare("SELECT * FROM messages WHERE id = ?").get(messageId);

    getAllMessages = (): Array<MessageEntity> =>
        this.db.prepare("SELECT * FROM messages").all();

    getChannelMessages = (channelId: number): Array<MessageEntity> =>
        this.db
            .prepare("SELECT * FROM messages WHERE channel = ?")
            .all(channelId);

    getMessageNumber = (): number =>
        this.db.prepare("SELECT COUNT(*) AS nber FROM messages").get().nber;

    deleteMessage = (messageId: number): void => {
        this.db.prepare("DELETE FROM messages WHERE id = ?").run(messageId);
    };

    getAllChannels = (): Array<ChannelEntity> =>
        this.db.prepare("SELECT * FROM channels").all();

    insertChannel = (channelData: ChannelDto): number => {
        this.db
            .prepare("INSERT INTO channels (name) VALUES (?)")
            .run(channelData.name);
        return this.db.prepare("SELECT last_insert_rowid() as id").get().id;
    };
}
