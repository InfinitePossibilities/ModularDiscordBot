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
    var _a, _b, _c;
    if (await util_1.tableExists('main_settings') && ((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available)) {
        if (!(await Auth.global.isDev('main_settings', msgObject.author) || await Auth.local.isLocalOwner(`${msgObject.guild.id}_settings`, msgObject.author, msgObject.guild) || await Auth.local.isLocalAdmin(`${msgObject.guild.id}_settings`, msgObject.author, msgObject.guild)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix + prefix}error to report an error.\``)
                .setFooter((_b = client.user) === null || _b === void 0 ? void 0 : _b.username, (_c = client.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL())
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
    }
    else {
        return false;
    }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZWNvbW1hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9leGFtcGxlY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0QyxtQ0FBbUM7QUFFbkMsMkNBQTJDO0FBQzNDLHFDQUE0RDtBQUM1RCx5Q0FBMkM7QUFDM0MseUNBQWdEO0FBRWhELE1BQU0sY0FBYztJQUFwQjtRQUNxQixhQUFRLEdBQUcsZ0JBQWdCLENBQUM7UUFDNUIsVUFBSyxHQUFHLGdEQUFnRCxDQUFDO1FBQ3pELFdBQU0sR0FBRyx1QkFBdUIsQ0FBQztRQUNqQyxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyxJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELElBQUksTUFBTSxHQUFHLElBQUks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