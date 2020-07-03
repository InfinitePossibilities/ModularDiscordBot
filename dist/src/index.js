"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = exports.events = exports.elevated_commands = exports.commands = void 0;
// APIs
const Discord = require("discord.js");
// const roblox = require('noblox.js');
const bloxyClient = require('devbloxy');
//
// Config
const Settings = require("./settings");
const config_1 = require("./config");
const util_1 = require("./util");
//
// Command Handlers
const util_2 = require("./util");
//
// Bot Variable
const bot = new Discord.Client();
//
// Declare, export, and load commands/events into memory
exports.commands = [];
exports.elevated_commands = [];
exports.events = [];
exports.directory = __dirname;
util_2.loadAllCommands(exports.commands, exports.elevated_commands, __dirname);
util_2.loadEvents(`${__dirname}/events`, exports.events);
//
// On Ready Event
bot.on("ready", async () => {
    util_2.handleEvent(bot, "readyevent", exports.events);
    util_2.handleEvent(bot, "robloxevent", exports.events, bloxyClient);
});
//
// On Message Event
bot.on("message", async (msg) => {
    var _a, _b, _c, _d;
    // If author is a bot
    if (msg.author.bot)
        return;
    // Check if main settings table exists. Allow only the setup command if not.
    if (msg.content.substring(2, 7) == ('setup')) {
        util_2.handleSetup(msg, bot, exports.elevated_commands);
        return;
    }
    // Handle the Message
    await util_2.handleEvent(bot, "messageevent", exports.events, msg);
    // Global Prefix
    let globalPrefix = String(await Settings.readSetting('main_settings', `prefix`));
    // Handle commands
    if (msg.channel.type != "dm") {
        if (!((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.available))
            return;
        if (!await util_1.tableExists(`${msg.guild.id}_settings`))
            return;
        // const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Local Prefix
        let localPrefix = String(await Settings.readSetting(`${msg.guild.id}_settings`, 'prefix'));
        const prefixRegex = new RegExp(`^(<@!?${(_b = bot.user) === null || _b === void 0 ? void 0 : _b.id}>)\\s*`);
        if (!(msg.content.startsWith(localPrefix) || prefixRegex.test(msg.content)) && !(msg.content.substring(0, 2) == (globalPrefix + globalPrefix)))
            return;
        // Ping
        (msg.content.toLowerCase() == localPrefix + "ping")
            ? msg.channel.send("Pong!")
            : util_2.handleCommand(bot, exports.commands, msg);
    }
    else if (!(msg.content.substring(0, 2) == (globalPrefix + globalPrefix))) {
        var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
        var _embed = new Discord.MessageEmbed;
        _embed.setTitle('Error')
            .setDescription(`\`For security purposes, you are not allowed to run nonelevated commands through Direct Messages! \n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
            .setFooter((_c = bot.user) === null || _c === void 0 ? void 0 : _c.username, (_d = bot.user) === null || _d === void 0 ? void 0 : _d.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor([255, 0, 0]);
        msg.channel.send(_embed);
        return;
    }
    if (msg.content.substring(0, 2) == (globalPrefix + globalPrefix)) {
        util_2.handleElevatedCommand(bot, exports.elevated_commands, msg);
    }
    return;
});
bot.login(config_1.config.token);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsT0FBTztBQUNQLHNDQUFzQztBQUN0Qyx1Q0FBdUM7QUFDdkMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLEVBQUU7QUFFRixTQUFTO0FBQ1QsdUNBQXVDO0FBRXZDLHFDQUFrQztBQUNsQyxpQ0FBaUQ7QUFNakQsRUFBRTtBQUVGLG1CQUFtQjtBQUNuQixpQ0FPZ0I7QUFDaEIsRUFBRTtBQUVGLGVBQWU7QUFDZixNQUFNLEdBQUcsR0FBbUIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakQsRUFBRTtBQUVGLHdEQUF3RDtBQUM3QyxRQUFBLFFBQVEsR0FBa0IsRUFBRSxDQUFDO0FBQzdCLFFBQUEsaUJBQWlCLEdBQWtCLEVBQUUsQ0FBQztBQUN0QyxRQUFBLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0FBQ3pCLFFBQUEsU0FBUyxHQUFJLFNBQVMsQ0FBQztBQUVsQyxzQkFBZSxDQUFDLGdCQUFRLEVBQUUseUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEQsaUJBQVUsQ0FBQyxHQUFHLFNBQVMsU0FBUyxFQUFFLGNBQU0sQ0FBQyxDQUFDO0FBQzFDLEVBQUU7QUFFRixpQkFBaUI7QUFDakIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDdkIsa0JBQVcsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQU0sQ0FBQyxDQUFDO0lBQ3ZDLGtCQUFXLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxjQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDekQsQ0FBQyxDQUFDLENBQUM7QUFDSCxFQUFFO0FBRUYsbUJBQW1CO0FBQ25CLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTs7SUFDMUIscUJBQXFCO0lBQ3JCLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHO1FBQUUsT0FBTztJQUUzQiw0RUFBNEU7SUFDNUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN6QyxrQkFBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUseUJBQWlCLENBQUMsQ0FBQztRQUN6QyxPQUFPO0tBQ1Y7SUFFRCxxQkFBcUI7SUFDckIsTUFBTSxrQkFBVyxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUUsY0FBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXBELGdCQUFnQjtJQUNoQixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRWpGLGtCQUFrQjtJQUNsQixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtRQUMxQixJQUFJLFFBQUMsR0FBRyxDQUFDLEtBQUssMENBQUUsU0FBUyxDQUFBO1lBQUUsT0FBTztRQUNsQyxJQUFJLENBQUMsTUFBTSxrQkFBVyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsQ0FBQztZQUFFLE9BQU87UUFDM0QsbUZBQW1GO1FBRW5GLGVBQWU7UUFDZixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsTUFBQSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBQyxZQUFZLENBQUMsQ0FBQztZQUFFLE9BQU87UUFDcEosT0FBTztRQUNQLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxXQUFXLEdBQUMsTUFBTSxDQUFDO1lBQzdDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDM0IsQ0FBQyxDQUFDLG9CQUFhLENBQUMsR0FBRyxFQUFFLGdCQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDM0M7U0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRTtRQUN0RSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3pFLElBQUksTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQztRQUV0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUNuQixjQUFjLENBQUMsOElBQThJLE1BQU0sNkJBQTZCLENBQUM7YUFDak0sU0FBUyxPQUFDLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLFFBQVEsUUFBQyxHQUFHLENBQUMsSUFBSSwwQ0FBRSxnQkFBZ0IsR0FBRzthQUMxRCxZQUFZLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQzthQUN4QixRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsT0FBTztLQUNWO0lBRUQsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLEVBQUU7UUFDN0QsNEJBQXFCLENBQUMsR0FBRyxFQUFFLHlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3REO0lBRUQsT0FBTztBQUNYLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMifQ==