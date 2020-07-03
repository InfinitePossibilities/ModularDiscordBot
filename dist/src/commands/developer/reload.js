"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const index_1 = require("../../index");
const filesystem = require("fs");
const Settings = require("../../settings");
const Auth = require("../../auth");
const util_1 = require("../../util");
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
                    var objDirectory = `${index_1.directory}/commands/${dirObject.toLowerCase()}`;
                    if (filesystem.existsSync(`${objDirectory}/${args[0].toLowerCase()}.js`)) {
                        delete require.cache[require.resolve(`${objDirectory}/${args[0].toLowerCase()}.js`)];
                        // Get Target Command
                        const newCommand = require(`${objDirectory}/${args[0].toLowerCase()}.js`);
                        const command = new newCommand;
                        // Find and delete the old Target Command
                        let loc = index_1.commands.findIndex(x => x.info.command() === args[0].toLowerCase());
                        index_1.commands.splice(loc, loc + 1);
                        // Add the new Target Command
                        index_1.commands.push(command);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2RldmVsb3Blci9yZWxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFFdEMsdUNBQWlEO0FBQ2pELGlDQUFpQztBQUVqQywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBRW5DLHFDQUF5QztBQUN6Qyx5Q0FBMkM7QUFFM0MsTUFBTSxNQUFNO0lBQVo7UUFDcUIsYUFBUSxHQUFHLFFBQVEsQ0FBQztRQUNwQixVQUFLLEdBQUcsaUdBQWlHLENBQUM7UUFDMUcsV0FBTSxHQUFHLGtCQUFrQixDQUFDO1FBQzVCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsU0FBUyxDQUFDO1FBRS9DLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLElBQUksRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFO1lBQ3JHLFlBQVk7WUFDWixJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELElBQUk7Z0JBQ0EsTUFB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