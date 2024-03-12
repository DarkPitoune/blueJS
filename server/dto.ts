export interface MessageDto {
    username: number;
    date: Date;
    channel: number;
    photo: string;
    content: string;
}

export interface ChannelDto {
    name: string;
}
