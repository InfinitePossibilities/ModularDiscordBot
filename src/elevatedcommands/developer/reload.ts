import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import { directory, elevated_commands }from "../../index";
import * as filesystem from "fs";

import * as Settings from "../../settings";
import * as Auth from "../../auth";
import { CommandType } from "../../config";

class reload implements IBotCommand {
    private readonly _command = "reload";
    private readonly _help = "Reloads a specified command, applying any saved changes into memory without restarting the bot."
    private readonly _usage = "reload [command]";
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
                    delete require.cache[require.resolve(`${objDirectory}/${args[0].toLowerCase()}.js`)];

                    // Get Target Command
                    const newCommand = require(`${objDirectory}/${args[0].toLowerCase()}.js`);
                    const command = new newCommand as IBotCommand;

                    // Find and delete the old Target Command
                    let loc = elevated_commands.findIndex(x => x.info.command() === args[0].toLowerCase());
                    elevated_commands.splice(loc, loc+1);

                    // Add the new Target Command
                    elevated_commands.push(command);

                    // Send message
                    let embed = new Discord.MessageEmbed();
                    embed.setAuthor("Reload")
                        .setColor([0,255,0])
                        .setDescription(`\`Successfully reloaded: ${args[0]}\``);
                    msgObject.channel.send(embed);
                }
            });
        }
        catch (exception) {
            // Log error Exception
            console.log(exception);
            
            // Send message
            let embed = new Discord.MessageEmbed();
            embed.setAuthor("Reload")
                .setColor([255,0,0])
                .setDescription(`\`Unable to reload: ${args[0]}\``);
            msgObject.channel.send(embed);
        }
    }
}

module.exports = reload;

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