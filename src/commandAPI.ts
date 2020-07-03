import * as Discord from "discord.js";
import { CommandType } from "./config";

export interface IBotCommand {
    info: {
        command(): string;
        help(): string;
        usage(): string;
        isTest(): boolean;
        Type(): CommandType;
    }
    runCommand(args: string[], msgObject: Discord.Message, bot: Discord.Client, commands: IBotCommand[]): Promise<void>;
}