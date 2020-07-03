import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import * as Settings from "../../settings";
import { commands } from "../../index";
import { setMainEmbedColor } from '../../util';
import { CommandType } from "../../config";

class help implements IBotCommand {
    private readonly _command = "help";
    private readonly _help = "Offers basic information and command syntax.";
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
        var _embed = new Discord.MessageEmbed();

        // Return if sender is a bot user
        if (msgObject.author.bot) return;

        if (args.length == 0) {
            // send Help Message if no arguements
            sendHelpList(client, msgObject, _embed);
        }else if (args.length > 0) {
            args[0].toLowerCase() == 'list' || args[0].toLowerCase() == '--keep' 
                ? sendHelpList(client, msgObject, _embed) 
                : sendCommandHelp(client, msgObject, _embed, args);
        }
    }
}

module.exports = help;

// async function 

let sendHelpList = async (client: Discord.Client, msgObject: Discord.Message, _embed: Discord.MessageEmbed) => {
    if (!msgObject.guild?.available) return;

    var _help = require("./help");
    var _helpClass = new _help() as IBotCommand;

    let prefix = String( await Settings.readSetting(`${msgObject.guild.id}_settings`, 'prefix') );

    var _title = ` 
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix + _helpClass.info.usage()}\`\n\n`;
    var _generalBuilder = `\`General Commands\`\n`;
    var _utilityBuilder = `\n\`Utility Commands\`\n`;
    var _developerCommands = `\n\`Development Commands\`\n`;

    for (const command of commands) {
        try {

            if (await command.info.isTest() == true) {}else {
                var commandName = command.info.command();

                switch (await command.info.Type()) {
                    case (CommandType.GENERAL): { _generalBuilder += `**-> ${commandName.charAt(0).toUpperCase()+commandName.slice(1)}**\n`; break; }
                    case (CommandType.UTILITY): { _utilityBuilder += `**-> ${commandName.charAt(0).toUpperCase()+commandName.slice(1)}**\n`; break; }
                    case (CommandType.DEVELOPER): { _developerCommands += `**-> ${commandName.charAt(0).toUpperCase()+commandName.slice(1)}**\n`; break; }
                }
            }

        }catch (exception) {
            console.log(exception);
        }
    }

    await setMainEmbedColor(`${msgObject.guild.id}_settings`, _embed);

    _embed.setAuthor("Help")
            .setDescription(_title+_generalBuilder+_utilityBuilder+_developerCommands)
            .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`,"botname"),client.user?.displayAvatarURL())
            .setTimestamp(new Date());

    var deleteEmbed = () => {
        msgObject.channel.send(_embed)
            .then(m => (m as Discord.Message).delete({timeout: 5000}));

        msgObject.delete({timeout: 5000});
    }

    msgObject.content.includes('--keep') 
        ? msgObject.channel.send(_embed) 
        : deleteEmbed();
}

let sendCommandHelp = async (client: Discord.Client, msgObject: Discord.Message, _embed: Discord.MessageEmbed, args: string[]) => {
    if (!msgObject.guild?.available) return;

    var _help = require(`./${args[0].toLowerCase()}`);
    var _helpClass = new _help() as IBotCommand;

    let prefix = String( await Settings.readSetting(`${msgObject.guild.id}_settings`, 'prefix') );

    var _title = `
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix + _helpClass.info.usage()}\`\n\n`;

    await setMainEmbedColor(`${msgObject.guild.id}_settings`, _embed);

    _embed.setAuthor("Help")
            .setDescription(_title)
            .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`,"botname"),client.user?.displayAvatarURL())
            .setTimestamp(new Date());

    var deleteEmbed = () => {
        msgObject.channel.send(_embed)
            .then(m => (m as Discord.Message).delete({timeout: 5000}));

        msgObject.delete({timeout: 5000});
    }

    msgObject.content.includes('--keep') 
        ? msgObject.channel.send(_embed) 
        : deleteEmbed();
}