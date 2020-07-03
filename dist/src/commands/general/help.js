"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Settings = require("../../settings");
const index_1 = require("../../index");
const util_1 = require("../../util");
const config_1 = require("../../config");
class help {
    constructor() {
        this._command = "help";
        this._help = "Offers basic information and command syntax.";
        this._usage = "help [command]";
        this._isTest = false;
        this._Type = config_1.CommandType.GENERAL;
        this.info = {
            command: () => { return this._command; },
            help: () => { return this._help; },
            usage: () => { return this._usage; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            var _embed = new Discord.MessageEmbed();
            // Return if sender is a bot user
            if (msgObject.author.bot)
                return;
            if (args.length == 0) {
                // send Help Message if no arguements
                sendHelpList(client, msgObject, _embed);
            }
            else if (args.length > 0) {
                args[0].toLowerCase() == 'list' || args[0].toLowerCase() == '--keep'
                    ? sendHelpList(client, msgObject, _embed)
                    : sendCommandHelp(client, msgObject, _embed, args);
            }
        };
    }
}
module.exports = help;
// async function 
let sendHelpList = async (client, msgObject, _embed) => {
    var _a, _b;
    if (!((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available))
        return;
    var _help = require("./help");
    var _helpClass = new _help();
    let prefix = String(await Settings.readSetting(`${msgObject.guild.id}_settings`, 'prefix'));
    var _title = ` 
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix + _helpClass.info.usage()}\`\n\n`;
    var _generalBuilder = `\`General Commands\`\n`;
    var _utilityBuilder = `\n\`Utility Commands\`\n`;
    var _developerCommands = `\n\`Development Commands\`\n`;
    for (const command of index_1.commands) {
        try {
            if (await command.info.isTest() == true) { }
            else {
                var commandName = command.info.command();
                switch (await command.info.Type()) {
                    case (config_1.CommandType.GENERAL): {
                        _generalBuilder += `**-> ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n`;
                        break;
                    }
                    case (config_1.CommandType.UTILITY): {
                        _utilityBuilder += `**-> ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n`;
                        break;
                    }
                    case (config_1.CommandType.DEVELOPER): {
                        _developerCommands += `**-> ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n`;
                        break;
                    }
                }
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
    await util_1.setMainEmbedColor(`${msgObject.guild.id}_settings`, _embed);
    _embed.setAuthor("Help")
        .setDescription(_title + _generalBuilder + _utilityBuilder + _developerCommands)
        .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`, "botname"), (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
        .setTimestamp(new Date());
    var deleteEmbed = () => {
        msgObject.channel.send(_embed)
            .then(m => m.delete({ timeout: 5000 }));
        msgObject.delete({ timeout: 5000 });
    };
    msgObject.content.includes('--keep')
        ? msgObject.channel.send(_embed)
        : deleteEmbed();
};
let sendCommandHelp = async (client, msgObject, _embed, args) => {
    var _a, _b;
    if (!((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available))
        return;
    var _help = require(`./${args[0].toLowerCase()}`);
    var _helpClass = new _help();
    let prefix = String(await Settings.readSetting(`${msgObject.guild.id}_settings`, 'prefix'));
    var _title = `
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix + _helpClass.info.usage()}\`\n\n`;
    await util_1.setMainEmbedColor(`${msgObject.guild.id}_settings`, _embed);
    _embed.setAuthor("Help")
        .setDescription(_title)
        .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`, "botname"), (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
        .setTimestamp(new Date());
    var deleteEmbed = () => {
        msgObject.channel.send(_embed)
            .then(m => m.delete({ timeout: 5000 }));
        msgObject.delete({ timeout: 5000 });
    };
    msgObject.content.includes('--keep')
        ? msgObject.channel.send(_embed)
        : deleteEmbed();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL2hlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFFdEMsMkNBQTJDO0FBQzNDLHVDQUF1QztBQUN2QyxxQ0FBK0M7QUFDL0MseUNBQTJDO0FBRTNDLE1BQU0sSUFBSTtJQUFWO1FBQ3FCLGFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEIsVUFBSyxHQUFHLDhDQUE4QyxDQUFDO1FBQ3ZELFdBQU0sR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyxJQUFJLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUV4QyxpQ0FBaUM7WUFDakMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUc7Z0JBQUUsT0FBTztZQUVqQyxJQUFJLElB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