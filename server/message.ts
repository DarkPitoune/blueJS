import { MessageEntity } from "./entities";
import { IDatabaseService } from "./database";
import { MessageDto } from "./dto";

export class MessageService {
    databaseService: IDatabaseService;
    constructor(databaseService: IDatabaseService) {
        this.databaseService = databaseService;
    }

    validateMessage = (message: any): MessageDto => {
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

    postMessage = (rawMessage: any): MessageEntity => {
        const messageData = this.validateMessage(rawMessage);
        const newMessageId = this.databaseService.insertMessage(messageData);

        return {
            id: newMessageId,
            ...messageData,
        };
    };

    getMessage = (id: number): MessageEntity => {
        const message = this.databaseService.getMessage(id);

        if (!message) {
            throw new Error(`message with id ${id} not found`);
        }
        return message;
    };

    getAllMessages = (): Array<MessageEntity> =>
        this.databaseService.getAllMessages();

    getChannelMessages = (id: number): Array<MessageEntity> =>
        this.databaseService.getChannelMessages(id);

    getMessageNumber = (): number => this.databaseService.getMessageNumber();

    deleteMessage = (id: number) => this.databaseService.deleteMessage(id);
}
