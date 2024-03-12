export interface MessageEntity {
    id: number;
    username: number;
    date: Date;
    channel: number;
    photo: string;
    content: string;
}

export interface ChannelEntity {
    id: number;
    name: string;
}
