"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Auth = require("../../auth");
const Settings = require("../../settings");
const index_1 = require("../../index");
const util_1 = require("../../util");
const config_1 = require("../../config");
class help {
    constructor() {
        this._command = "help";
        this._help = "Shows help information and command syntax for advanced commands";
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
            if (!await authenticate(msgObject, client))
                return;
            var _embed = new Discord.MessageEmbed();
            // Return if sender is a bot user
            if (msgObject.author.bot)
                return;
            if (args.length == 0) {
                // send Help Message if no arguements
                sendHelpList(client, msgObject, _embed);
            }
            else if (args.length > 0) {
                if (args[0].toLowerCase() == 'list' || args[0].toLowerCase() == '--keep') {
                    // Send Help Message if appropriate
                    sendHelpList(client, msgObject, _embed);
                }
                else {
                    sendCommandHelp(client, msgObject, _embed, args);
                }
            }
        };
    }
}
module.exports = help;
// async function 
let sendHelpList = async (client, msgObject, _embed) => {
    var _a, _b;
    var _help = require("./help");
    var _helpClass = new _help();
    let prefix = String(await Settings.readSetting(`main_settings`, 'prefix'));
    var _title = `
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix + prefix + _helpClass.info.usage()}\`\n\n`;
    var _generalBuilder = `\`General Commands\`\n`;
    var _utilityBuilder = `\n\`Utility Commands\`\n`;
    var _developerCommands = `\n\`Development Commands\`\n`;
    for (const command of index_1.elevated_commands) {
        try {
            if (command.info.isTest() == true) { }
            else {
                var commandName = command.info.command();
                if (await command.info.Type() == config_1.CommandType.GENERAL) {
                    _generalBuilder += `**-> ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n`;
                }
                else if (await command.info.Type() == config_1.CommandType.UTILITY) {
                    _utilityBuilder += `**-> ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n`;
                }
                else if (await command.info.Type() == config_1.CommandType.DEVELOPER) {
                    _developerCommands += `**-> ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n`;
                }
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
    await util_1.setMainEmbedColor(`main_settings`, _embed);
    _embed.setAuthor("Elevated Help")
        .setDescription(_title + _generalBuilder + _utilityBuilder + _developerCommands)
        .setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
        .setTimestamp(new Date());
    if (msgObject.content.includes('--keep')) {
        msgObject.channel.send(_embed);
    }
    else {
        msgObject.channel.send(_embed)
            .then(m => m.delete({ timeout: 5000 }));
        if (msgObject.channel.type != "dm") {
            msgObject.delete({ timeout: 5000 });
        }
        ;
    }
};
let sendCommandHelp = async (client, msgObject, _embed, args) => {
    var _a, _b;
    var _help = require(`./${args[0].toLowerCase()}`);
    var _helpClass = new _help();
    let prefix = String(await Settings.readSetting(`main_settings`, 'prefix'));
    var _title = `
        ${_helpClass.info.help()}\n
        \`Usage: ${prefix + prefix + _helpClass.info.usage()}\`\n\n`;
    await util_1.setMainEmbedColor(`main_settings`, _embed);
    _embed.setAuthor("Help")
        .setDescription(_title)
        .setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
        .setTimestamp(new Date());
    if (msgObject.content.includes('--keep')) {
        msgObject.channel.send(_embed);
    }
    else {
        msgObject.channel.send(_embed)
            .then(m => m.delete({ timeout: 5000 }));
        msgObject.delete({ timeout: 5000 });
    }
};
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (!(await Auth.global.isGlobalEmpowered('main_settings', msgObject.author)) && !msgObject.author.bot) {
        var _embed = new Discord.MessageEmbed();
        var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
        _embed.setTitle("Error!")
            .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix + prefix}error to report an error.\``)
            .setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor([255, 0, 0]);
        await msgObject.channel.send(_embed)
            .then(msg => {
            msg.delete({ timeout: 5000 });
            msgObject.delete({ timeout: 5000 });
        });
        return false;
    }
    else {
        return true;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9lbGV2YXRlZGNvbW1hbmRzL2dlbmVyYWwvaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0QyxtQ0FBbUM7QUFFbkMsMkNBQTJDO0FBQzNDLHVDQUFnRDtBQUNoRCxxQ0FBK0M7QUFDL0MseUNBQTJDO0FBRTNDLE1BQU0sSUFBSTtJQUFWO1FBQ3FCLGFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEIsVUFBSyxHQUFHLGlFQUFpRSxDQUFDO1FBQzFFLFdBQU0sR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyxJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELElBQUksTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVks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