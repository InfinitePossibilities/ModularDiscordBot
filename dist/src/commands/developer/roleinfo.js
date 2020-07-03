"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Settings = require("../../settings");
const Auth = require("../../auth");
const util_1 = require("../../util");
const util_2 = require("../../util");
const config_1 = require("../../config");
class roleinfo {
    constructor() {
        this._command = "roleinfo";
        this._help = "Shows information about a specified role.";
        this._usage = "roleinfo [discord_role]";
        this._isTest = false;
        this._Type = config_1.CommandType.DEVELOPER;
        this.info = {
            command: () => { return this._command; },
            help: () => { return this._help; },
            usage: () => { return this._usage; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            var _a, _b, _c, _d, _e, _f;
            if (!await authenticate(msgObject, client))
                return;
            try {
                if ((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available) {
                    var embed = new Discord.MessageEmbed();
                    var argBuilder = args.join(" ");
                    // Set color for embeds
                    await util_2.setMainEmbedColor(`${(_b = msgObject.guild) === null || _b === void 0 ? void 0 : _b.id}_settings`, embed);
                    embed.setAuthor(`Info: ${(_d = (_c = msgObject.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find((r) => r.name.toLowerCase() == argBuilder.toLowerCase())) === null || _d === void 0 ? void 0 : _d.name}`)
                        .setDescription(`\`ID: ${(_f = (_e = msgObject.guild) === null || _e === void 0 ? void 0 : _e.roles.cache.find((r) => r.name.toLowerCase() == argBuilder.toLowerCase())) === null || _f === void 0 ? void 0 : _f.id}\``);
                    msgObject.channel.send(embed);
                }
            }
            catch (_g) { }
        };
    }
}
module.exports = roleinfo;
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (await util_1.tableExists('main_settings') && ((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available)) {
        if (!(await Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
                .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`, "botname"), (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvZGV2ZWxvcGVyL3JvbGVpbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBR3RDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFFbkMscUNBQXlDO0FBQ3pDLHFDQUErQztBQUMvQyx5Q0FBMkM7QUFFM0MsTUFBTSxRQUFRO0lBQWQ7UUFDcUIsYUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN0QixVQUFLLEdBQUcsMkNBQTJDLENBQUM7UUFDcEQsV0FBTSxHQUFHLHlCQUF5QixDQUFDO1FBQ25DLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsU0FBUyxDQUFDO1FBRS9DLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLElBQUksRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFOztZQUVyRyxJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELElBQUk7Z0JBQ0EsVUFBSSxTQUFTLENBQUMsS0FBSyww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