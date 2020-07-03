"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Settings = require("../../settings");
const Auth = require("../../auth");
const config_1 = require("../../config");
class toggle {
    constructor() {
        this._command = "toggle";
        this._help = "Toggles the bot on/off.";
        this._usage = "toggle";
        this._isTest = false;
        this._Type = config_1.CommandType.UTILITY;
        this.info = {
            command: () => { return this._command; },
            help: () => { return this._help; },
            usage: () => { return this._usage; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            var _a, _b, _c;
            if (!await authenticate(msgObject, client))
                return;
            var embed = new Discord.MessageEmbed();
            embed.setAuthor('Status')
                .setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username)
                .setTimestamp(new Date());
            if (await Settings.readSetting('main_settings', 'running') == 'true') {
                msgObject.delete();
                Settings.writeSetting('main_settings', 'running', 'false');
                embed.setDescription(`:x: Bot is now Offline.`)
                    .setColor([255, 0, 0]);
                msgObject.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));
                msgObject.author.send(embed);
                (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({ status: 'idle' });
            }
            else {
                msgObject.delete();
                Settings.writeSetting('main_settings', 'running', 'true');
                embed.setDescription(':white_check_mark: Bot is now Online.')
                    .setColor([90, 255, 87]);
                msgObject.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));
                msgObject.author.send(embed);
                (_c = client.user) === null || _c === void 0 ? void 0 : _c.setPresence({ status: 'dnd' });
            }
        };
    }
}
module.exports = toggle;
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (!(await Auth.global.isDev(`main_settings`, msgObject.author) || await Auth.global.isGlobalAdmin(`main_settings`, msgObject.author)) && !msgObject.author.bot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VsZXZhdGVkY29tbWFuZHMvdXRpbGl0eS90b2dnbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFFdEMsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyx5Q0FBMkM7QUFFM0MsTUFBTSxNQUFNO0lBQVo7UUFDcUIsYUFBUSxHQUFHLFFBQVEsQ0FBQztRQUNwQixVQUFLLEdBQUcseUJBQXlCLENBQUM7UUFDbEMsV0FBTSxHQUFHLFFBQVEsQ0FBQztRQUNsQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTs7WUFFckcsSUFBSSxDQUFDLE1BQU0sWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQUUsT0FBTztZQUVuRCxJQUFJLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUV2QyxLQUFLLENB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