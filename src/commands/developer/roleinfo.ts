import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";

import * as Settings from "../../settings";
import * as Auth from "../../auth";

import { tableExists } from "../../util";
import { setMainEmbedColor } from "../../util";
import { CommandType } from "../../config";

class roleinfo implements IBotCommand {
    private readonly _command = "roleinfo";
    private readonly _help = "Shows information about a specified role.";
    private readonly _usage = "roleinfo [discord_role]";
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
        
        if (!await authenticate(msgObject, client)) return;

        try {
            if (msgObject.guild?.available) {
                var embed = new Discord.MessageEmbed();
                var argBuilder = args.join(" ");

                // Set color for embeds
                await setMainEmbedColor(`${msgObject.guild?.id}_settings`, embed);

                embed.setAuthor(`Info: ${msgObject.guild?.roles.cache.find((r: Discord.Role) => r.name.toLowerCase() == argBuilder.toLowerCase())?.name}`)
                    .setDescription(`\`ID: ${msgObject.guild?.roles.cache.find((r: Discord.Role) => r.name.toLowerCase() == argBuilder.toLowerCase())?.id}\``);

                msgObject.channel.send(embed);
            }

        }catch{}
    }
}

module.exports = roleinfo;

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