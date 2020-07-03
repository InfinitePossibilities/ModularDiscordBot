import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import * as Auth from '../../auth';

import * as Settings from "../../settings";
import { elevated_commands } from "../../index";
import { setMainEmbedColor } from '../../util';
import { CommandType } from "../../config";

class help implements IBotCommand {
    private readonly _command = "help";
    private readonly _help = "Shows help information and command syntax for advanced commands";
    private readonly _usage = "help [command]";
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
            // send Help Message if no arguements
            sendHelpList(client, msgObject, _embed);
        }else if (args.length > 0) {
            if (args[0].toLowerCase() == 'list' || args[0].toLowerCase() == '--keep') {
                // Send Help Message if appropriate
                sendHelpList(client, msgObject, _embed);
            }else {
                sendCommandHelp(client, msgObject, _embed, args);
            }
        }
    }
}

module.exports = help;

// async function 

let sendHelpList = async (client: Discord.Client, msgObject: Discord.Message, _embed: Discord.MessageEmbed): Promise<void> => {
    var _help = require("./help");
    var _helpClass = new _help() as IBotCommand;

    let prefix = String( await Settings.readSetting(`main_settings`, 'prefix') );

    var _title = `
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix+prefix + _helpClass.info.usage()}\`\n\n`;
    var _generalBuilder = `\`General Commands\`\n`;
    var _utilityBuilder = `\n\`Utility Commands\`\n`;
    var _developerCommands = `\n\`Development Commands\`\n`;

    for (const command of elevated_commands) {
        try {

            if (command.info.isTest() == true) {}else {
                var commandName = command.info.command();

                if (await command.info.Type() == CommandType.GENERAL) {
                    _generalBuilder += `**-> ${commandName.charAt(0).toUpperCase()+commandName.slice(1)}**\n`;
                }else if (await command.info.Type() == CommandType.UTILITY) {
                    _utilityBuilder += `**-> ${commandName.charAt(0).toUpperCase()+commandName.slice(1)}**\n`;
                }else if (await command.info.Type() == CommandType.DEVELOPER) {
                    _developerCommands += `**-> ${commandName.charAt(0).toUpperCase()+commandName.slice(1)}**\n`;
                }
        
            }

        }catch (exception) {
            console.log(exception);
        }
    }

    await setMainEmbedColor(`main_settings`, _embed);

    _embed.setAuthor("Elevated Help")
            .setDescription(_title+_generalBuilder+_utilityBuilder+_developerCommands)
            .setFooter(client.user?.username,client.user?.displayAvatarURL())
            .setTimestamp(new Date());

    if (msgObject.content.includes('--keep')) {
        msgObject.channel.send(_embed);
    }else {
        msgObject.channel.send(_embed)
            .then(m => (m as Discord.Message).delete({timeout: 5000}));
        if (msgObject.channel.type != "dm") { msgObject.delete({timeout: 5000}) };
    }
}

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

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (!(await Auth.global.isGlobalEmpowered('main_settings', msgObject.author)) && !msgObject.author.bot) {
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