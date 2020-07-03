import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import * as Settings from "../../settings";
import * as Auth from "../../auth";
import { CommandType } from "../../config";

class toggle implements IBotCommand {
    private readonly _command = "toggle";
    private readonly _help = "Toggles the bot on/off.";
    private readonly _usage = "toggle";
    private readonly _isTest = false;
    private readonly _Type = CommandType.UTILITY;

    info = {
        command: (): string => { return this._command },
        help: (): string => { return this._help },
        usage: (): string => { return this._usage },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {

        if (!await authenticate(msgObject, client)) return;
        
        var embed = new Discord.MessageEmbed();

        embed.setAuthor('Status')
            .setFooter(client.user?.username)
            .setTimestamp(new Date());

        if (await Settings.readSetting('main_settings', 'running') == 'true') {
            msgObject.delete();
            Settings.writeSetting('main_settings', 'running', 'false');
            embed.setDescription(`:x: Bot is now Offline.`)
                .setColor([255, 0, 0]);
            msgObject.channel.send(embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
            msgObject.author.send(embed);

            client.user?.setPresence({status: 'idle'});
        }else {
            msgObject.delete();
            Settings.writeSetting('main_settings', 'running', 'true');
            embed.setDescription(':white_check_mark: Bot is now Online.')
                .setColor([90, 255, 87]);
            msgObject.channel.send(embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
            msgObject.author.send(embed);

            client.user?.setPresence({status: 'dnd'});
        }
    }
}

module.exports = toggle;

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (!(await Auth.global.isDev(`main_settings`, msgObject.author) || await Auth.global.isGlobalAdmin(`main_settings`, msgObject.author)) && !msgObject.author.bot) {
        var _embed = new Discord.MessageEmbed();
        var prefix = String(await Settings.readSetting('main_settings','prefix'));

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