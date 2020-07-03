import * as Discord from "discord.js";
import { EventType } from "./config";

export interface IBotEvent {
    info: {
        event(): string;
        help(): string;
        isTest(): boolean;
        Type(): EventType;
    }
    runEvent(bot: Discord.Client, extra: any): Promise<void>;
}