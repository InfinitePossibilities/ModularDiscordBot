"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const index_1 = require("../../index");
const filesystem = require("fs");
const Settings = require("../../settings");
const Auth = require("../../auth");
const config_1 = require("../../config");
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
                    var objDirectory = `${index_1.directory}/elevatedcommands/${dirObject.toLowerCase()}`;
                    if (filesystem.existsSync(`${objDirectory}/${args[0].toLowerCase()}.js`)) {
                        delete require.cache[require.resolve(`${objDirectory}/${args[0].toLowerCase()}.js`)];
                        // Find and delete the old Target Command
                        let loc = index_1.elevated_commands.findIndex(x => x.info.command() === args[0].toLowerCase());
                        index_1.elevated_commands.splice(loc, loc + 1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9lbGV2YXRlZGNvbW1hbmRzL2RldmVsb3Blci9kaXNhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBRXRDLHVDQUEyRDtBQUMzRCxpQ0FBaUM7QUFFakMsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyx5Q0FBMkM7QUFFM0MsTUFBTSxPQUFPO0lBQWI7UUFDcUIsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUNyQixVQUFLLEdBQUcsK0ZBQStGLENBQUM7UUFDeEcsV0FBTSxHQUFHLG1CQUFtQixDQUFDO1FBQzdCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsU0FBUyxDQUFDO1FBRS9DLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLElBQUksRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFO1lBQ3JHLFlBQVk7WUFDWixJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELElBQUk7Z0JBQ0EsTUFBTSxD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