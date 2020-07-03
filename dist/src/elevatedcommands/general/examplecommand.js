"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Auth = require("../../auth");
const Settings = require("../../settings");
const util_1 = require("../../util");
const config_1 = require("../../config");
const config_2 = require("../../config");
class examplecommand {
    constructor() {
        this._command = "examplecommand";
        this._help = "Forces the bot to say text into a chat channel";
        this._usage = "examplecommand [text]";
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
                // Send command help to channel where command
                sendCommandHelp(client, msgObject, _embed, args);
            }
            else if (args.length > 0) {
                // Send chat message to channel where command originated
                sendMessage(client, msgObject, _embed, args);
            }
        };
    }
}
module.exports = examplecommand;
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
let sendMessage = async (client, msgObject, _embed, args) => {
    // Remove override arguments from argument list
    var newArgs = args;
    for (var x in config_2.commandOverrides) {
        for (var y in newArgs) {
            if (newArgs[y] == `--${config_2.commandOverrides[x]}`) {
                newArgs.splice(Number(y), 1);
            }
        }
    }
    // Set basic embed settings
    await util_1.setMainEmbedColor(`main_settings`, _embed);
    _embed.setDescription(newArgs.join(" "));
    if (!msgObject.content.includes("--keep")) {
        msgObject.delete();
    }
    msgObject.channel.send(_embed);
};
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (!(await Auth.global.isDev('main_settings', msgObject.author) || await Auth.global.isGlobalAdmin('main_settings', msgObject.author)) && !msgObject.author.bot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZWNvbW1hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZWxldmF0ZWRjb21tYW5kcy9nZW5lcmFsL2V4YW1wbGVjb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBRXRDLG1DQUFtQztBQUVuQywyQ0FBMkM7QUFFM0MscUNBQStDO0FBQy9DLHlDQUEyQztBQUMzQyx5Q0FBZ0Q7QUFFaEQsTUFBTSxjQUFjO0lBQXBCO1FBQ3FCLGFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztRQUM1QixVQUFLLEdBQUcsZ0RBQWdELENBQUM7UUFDekQsV0FBTSxHQUFHLHVCQUF1QixDQUFDO1FBQ2pDLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLElBQUksRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFO1lBQ3JHLElBQUksQ0FBQyxNQUFNLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO2dCQUFFLE9BQU87WUFFbkQsSUFBSSxNQUFNLEdB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