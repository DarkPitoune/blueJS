import { IDatabaseService } from "./database";
import { ChannelEntity } from "./entities";
import { ChannelDto } from "./dto";

export class ChannelService {
    databaseService: IDatabaseService;
    constructor(databaseService: IDatabaseService) {
        this.databaseService = databaseService;
    }

    validateChannel = (channel: any): ChannelDto => {
        if (!channel.name) {
            throw new Error("name is required");
        }
        return { name: channel.name };
    };

    getAllChannels = (): Array<ChannelEntity> =>
        this.databaseService.getAllChannels();

    postChannel = (rawChannel: any) => {
        const channelData = this.validateChannel(rawChannel);
        const newId = this.databaseService.insertChannel(channelData);

        return {
            id: newId,
            ...channelData,
        };
    };
}
