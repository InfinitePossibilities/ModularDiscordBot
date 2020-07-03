import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import * as Auth from '../../auth';

import * as Settings from "../../settings";
import { elevated_commands } from "../../index";
import { setMainEmbedColor } from '../../util';
import { CommandType } from "../../config";
import { commandOverrides } from "../../config";

class examplecommand implements IBotCommand {
    private readonly _command = "examplecommand";
    private readonly _help = "Forces the bot to say text into a chat channel";
    private readonly _usage = "examplecommand [text]";
    private readonly _isTest = false;
    private readonly _Type = CommandType.GENERAL;

    info = {
        command: (): string => { return this._command },
        help: (): string => { return this._help },
        usage: (): string => { return this._usage },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        if (!await authenticate(msgObject, client)) return;

        var _embed = new Discord.MessageEmbed();

        // Return if sender is a bot user
        if (msgObject.author.bot) return;

        if (args.length == 0) {
            // Send command help to channel where command
            sendCommandHelp(client, msgObject, _embed, args);
        }else if (args.length > 0) {
            // Send chat message to channel where command originated
            sendMessage(client, msgObject, _embed, args);
        }
    }
}

module.exports = examplecommand;

let sendCommandHelp = async (client: Discord.Client, msgObject: Discord.Message, _embed: Discord.MessageEmbed, args: string[]): Promise<void> => {
    var _help = require(`./${args[0].toLowerCase()}`);
    var _helpClass = new _help() as IBotCommand;

    let prefix = String( await Settings.readSetting(`main_settings`, 'prefix') );

    var _title = `
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix+prefix + _helpClass.info.usage()}\`\n\n`;

    await setMainEmbedColor(`main_settings`, _embed);

    _embed.setAuthor("Help")
            .setDescription(_title)
            .setFooter(client.user?.username,client.user?.displayAvatarURL())
            .setTimestamp(new Date());

    if (msgObject.content.includes('--keep')) {
        msgObject.channel.send(_embed);
    }else {
        msgObject.channel.send(_embed)
            .then(m => (m as Discord.Message).delete({timeout: 5000}));

        msgObject.delete({timeout: 5000});
    }
}

let sendMessage = async (client: Discord.Client, msgObject: Discord.Message, _embed: Discord.MessageEmbed, args: string[]): Promise<void> => {
    // Remove override arguments from argument list

    var newArgs = args;

    for (var x in commandOverrides) { for (var y in newArgs) {
        if (newArgs[y] == `--${commandOverrides[x]}`) {
            newArgs.splice(Number(y),1);
        }
    }}

    // Set basic embed settings
    await setMainEmbedColor(`main_settings`, _embed);
    _embed.setDescription(newArgs.join(" "));

    if (!msgObject.content.includes("--keep")) {
        msgObject.delete();
    }

    msgObject.channel.send(_embed);
}

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (!(await Auth.global.isDev('main_settings', msgObject.author) || await Auth.global.isGlobalAdmin('main_settings', msgObject.author)) && !msgObject.author.bot) {
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