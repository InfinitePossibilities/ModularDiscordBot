"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const index_1 = require("../../index");
const filesystem = require("fs");
const Settings = require("../../settings");
const Auth = require("../../auth");
const config_1 = require("../../config");
class reload {
    constructor() {
        this._command = "reload";
        this._help = "Reloads a specified command, applying any saved changes into memory without restarting the bot.";
        this._usage = "reload [command]";
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
                    var objDirectory = `${index_1.directory}/elevatedcommands/${dirObject.toLowerCase()}`;
                    if (filesystem.existsSync(`${objDirectory}/${args[0].toLowerCase()}.js`)) {
                        delete require.cache[require.resolve(`${objDirectory}/${args[0].toLowerCase()}.js`)];
                        // Get Target Command
                        const newCommand = require(`${objDirectory}/${args[0].toLowerCase()}.js`);
                        const command = new newCommand;
                        // Find and delete the old Target Command
                        let loc = index_1.elevated_commands.findIndex(x => x.info.command() === args[0].toLowerCase());
                        index_1.elevated_commands.splice(loc, loc + 1);
                        // Add the new Target Command
                        index_1.elevated_commands.push(command);
                        // Send message
                        let embed = new Discord.MessageEmbed();
                        embed.setAuthor("Reload")
                            .setColor([0, 255, 0])
                            .setDescription(`\`Successfully reloaded: ${args[0]}\``);
                        msgObject.channel.send(embed);
                    }
                });
            }
            catch (exception) {
                // Log error Exception
                console.log(exception);
                // Send message
                let embed = new Discord.MessageEmbed();
                embed.setAuthor("Reload")
                    .setColor([255, 0, 0])
                    .setDescription(`\`Unable to reload: ${args[0]}\``);
                msgObject.channel.send(embed);
            }
        };
    }
}
module.exports = reload;
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (!(await Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VsZXZhdGVkY29tbWFuZHMvZGV2ZWxvcGVyL3JlbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0Qyx1Q0FBMEQ7QUFDMUQsaUNBQWlDO0FBRWpDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMseUNBQTJDO0FBRTNDLE1BQU0sTUFBTTtJQUFaO1FBQ3FCLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFDcEIsVUFBSyxHQUFHLGlHQUFpRyxDQUFBO1FBQ3pHLFdBQU0sR0FBRyxrQkFBa0IsQ0FBQztRQUM1QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLFNBQVMsQ0FBQztRQUUvQyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyxZQUFZO1lBQ1osSUFBSSxDQUFDLE1BQU0sWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQUUsT0FBTztZQUVuRCxJQUFJO2dCQUNBLE1BQU0sQ0FB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