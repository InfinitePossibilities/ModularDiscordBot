import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import { directory, elevated_commands } from "../../index";
import * as filesystem from "fs";

import * as Settings from "../../settings";
import * as Auth from "../../auth";
import { CommandType } from "../../config";

class enable implements IBotCommand {
    private readonly _command = "enable";
    private readonly _help = "Loads a specific command into memory, allowing for hot-swapping without disabling the bot.";
    private readonly _usage = "enable [command]";
    private readonly _isTest = false;
    private readonly _Type = CommandType.DEVELOPER;

    info = {
        command: (): string => { return this._command },
        help: (): string => { return this._help },
        usage: (): string => { return this._usage },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // Dev Check
        if (!await authenticate(msgObject, client)) return;

        try {

            Object.keys(CommandType).forEach((dirObject: string) => {
                var objDirectory = `${directory}/elevatedcommands/${dirObject.toLowerCase()}`;
                
                if (filesystem.existsSync(`${objDirectory}/${args[0].toLowerCase()}.js`)) {
                    // Get Target Command
                    const newCommand = require(`${objDirectory}/${args[0].toLowerCase()}.js`);
                    const command = new newCommand as IBotCommand;

                    // Add the new Target Command
                    elevated_commands.push(command);

                    // Send message
                    let embed = new Discord.MessageEmbed();

                    embed.setAuthor("Enable")
                        .setColor([0,255,0])
                        .setDescription(`\`Successfully enabled: ${args[0]}\``);

                    msgObject.channel.send(embed);     
                }
            });
        }
        catch (exception) {
            // Log error Exception
            console.log(exception);
            
            // Send message
            let embed = new Discord.MessageEmbed();

            embed.setAuthor("Enable")
                .setColor([255,0,0])
                .setDescription(`\`Unable to enable: ${args[0]}\``);

            msgObject.channel.send(embed);
        }
    }
}

module.exports = enable;

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (!(await Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
        var _embed = new Discord.MessageEmbed();
        var prefix = String(await Settings.readSetting('main_settings','prefix'))

        _embed.setTitle("Error!")
            .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix+prefix}error to report an error.\``)
            .setFooter(client.user?.username,client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor([255,0,0]);
        
        await msgObject.channel.send(_embed)
            .then(msg => {
                (msg as Discord.Message).delete({timeout: 5000});
                msgObject.delete({timeout: 5000});
            });

        return false;
    }else {
        return true;
    }
}