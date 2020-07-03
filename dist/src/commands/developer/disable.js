"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const index_1 = require("../../index");
const filesystem = require("fs");
const config_1 = require("../../config");
const Settings = require("../../settings");
const Auth = require("../../auth");
const util_1 = require("../../util");
class disable {
    constructor() {
        this._command = "disable";
        this._help = "Unloads a specified command from memory, allowing for hot-swapping without disabling the bot.";
        this._usage = "disable [command]";
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
            // Dev Check
            if (!await authenticate(msgObject, client))
                return;
            try {
                Object.keys(config_1.CommandType).forEach((dirObject) => {
                    var objDirectory = `${index_1.directory}/commands/${dirObject.toLowerCase()}`;
                    if (filesystem.existsSync(`${objDirectory}/${args[0].toLowerCase()}.js`)) {
                        delete require.cache[require.resolve(`${objDirectory}/${args[0].toLowerCase()}.js`)];
                        // Find and delete the old Target Command
                        let loc = index_1.commands.findIndex(x => x.info.command() === args[0].toLowerCase());
                        index_1.commands.splice(loc, loc + 1);
                        // Send message
                        let embed = new Discord.MessageEmbed();
                        embed.setAuthor("Disable")
                            .setColor([0, 255, 0])
                            .setDescription(`\`Successfully disabled: ${args[0]}\``);
                        msgObject.channel.send(embed);
                    }
                });
            }
            catch (exception) {
                // Log error Exception
                console.log(exception);
                // Send message
                let embed = new Discord.MessageEmbed();
                embed.setAuthor("Disable")
                    .setColor([255, 0, 0])
                    .setDescription(`\`Unable to disable: ${args[0]}\``);
                msgObject.channel.send(embed);
            }
        };
    }
}
module.exports = disable;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9kZXZlbG9wZXIvZGlzYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0Qyx1Q0FBaUQ7QUFDakQsaUNBQWlDO0FBRWpDLHlDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBRW5DLHFDQUF5QztBQUV6QyxNQUFNLE9BQU87SUFBYjtRQUNxQixhQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLFVBQUssR0FBRywrRkFBK0YsQ0FBQztRQUN4RyxXQUFNLEdBQUcsbUJBQW1CLENBQUM7UUFDN0IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxTQUFTLENBQUM7UUFFL0MsU0FBSSxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDL0MsSUFBSSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7WUFDekMsS0FBSyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLEdBQWdCLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1NBQ2pELENBQUE7UUFFRCxlQUFVLEdBQUcsS0FBSyxFQUFFLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQWlCLEVBQUU7WUFDckcsWUFBWTtZQUNaLElBQUksQ0FBQyxNQUFNLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO2dCQUFFLE9BQU87WUFFbkQsSUFBSTtnQkFDQSxN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