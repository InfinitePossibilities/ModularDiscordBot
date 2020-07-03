"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const index_1 = require("../../index");
const filesystem = require("fs");
const Settings = require("../../settings");
const Auth = require("../../auth");
const config_1 = require("../../config");
class enable {
    constructor() {
        this._command = "enable";
        this._help = "Loads a specific command into memory, allowing for hot-swapping without disabling the bot.";
        this._usage = "enable [command]";
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
                        // Get Target Command
                        const newCommand = require(`${objDirectory}/${args[0].toLowerCase()}.js`);
                        const command = new newCommand;
                        // Add the new Target Command
                        index_1.elevated_commands.push(command);
                        // Send message
                        let embed = new Discord.MessageEmbed();
                        embed.setAuthor("Enable")
                            .setColor([0, 255, 0])
                            .setDescription(`\`Successfully enabled: ${args[0]}\``);
                        msgObject.channel.send(embed);
                    }
                });
            }
            catch (exception) {
                // Log error Exception
                console.log(exception);
                // Send message
                let embed = new Discord.MessageEmbed();
                embed.setAuthor("Enable")
                    .setColor([255, 0, 0])
                    .setDescription(`\`Unable to enable: ${args[0]}\``);
                msgObject.channel.send(embed);
            }
        };
    }
}
module.exports = enable;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5hYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VsZXZhdGVkY29tbWFuZHMvZGV2ZWxvcGVyL2VuYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0Qyx1Q0FBMkQ7QUFDM0QsaUNBQWlDO0FBRWpDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMseUNBQTJDO0FBRTNDLE1BQU0sTUFBTTtJQUFaO1FBQ3FCLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFDcEIsVUFBSyxHQUFHLDRGQUE0RixDQUFDO1FBQ3JHLFdBQU0sR0FBRyxrQkFBa0IsQ0FBQztRQUM1QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLFNBQVMsQ0FBQztRQUUvQyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyxZQUFZO1lBQ1osSUFBSSxDQUFDLE1BQU0sWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQUUsT0FBTztZQUVuRCxJQUFJO2dCQUVBLE1BQU0sQ0FB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