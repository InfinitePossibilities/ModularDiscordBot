import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import { commands, directory }from "../../index";
import * as filesystem from "fs";

import { CommandType } from "../../config";
import * as Settings from "../../settings";
import * as Auth from "../../auth";

import { tableExists } from "../../util";

class disable implements IBotCommand {
    private readonly _command = "disable";
    private readonly _help = "Unloads a specified command from memory, allowing for hot-swapping without disabling the bot.";
    private readonly _usage = "disable [command]";
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
                var objDirectory = `${directory}/commands/${dirObject.toLowerCase()}`;
                if (filesystem.existsSync(`${objDirectory}/${args[0].toLowerCase()}.js`)) {
                    delete require.cache[require.resolve(`${objDirectory}/${args[0].toLowerCase()}.js`)];

                    // Find and delete the old Target Command
                    let loc = commands.findIndex(x => x.info.command() === args[0].toLowerCase());
                    commands.splice(loc, loc+1);

                    // Send message
                    let embed = new Discord.MessageEmbed();

                    embed.setAuthor("Disable")
                        .setColor([0,255,0])
                        .setDescription(`\`Successfully disabled: ${args[0]}\``);

                    msgObject.channel.send(embed);
                }
            });
        }
        catch (exception) {
            // Log error Exception
            console.log(exception);
            
            // Send message
            let embed = new Discord.MessageEmbed();

            embed.setAuthor("Disable")
                .setColor([255,0,0])
                .setDescription(`\`Unable to disable: ${args[0]}\``);

            msgObject.channel.send(embed);
        }
    }
}

module.exports = disable;

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (await tableExists('main_settings') && msgObject.guild?.available) {
        if (!(await Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings','prefix'))

            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
                .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`,"botname"),client.user?.displayAvatarURL())
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
    }else { return false; };
}