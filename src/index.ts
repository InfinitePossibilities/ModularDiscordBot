// APIs
import * as Discord from "discord.js";
// const roblox = require('noblox.js');
const bloxyClient = require('devbloxy');
//

// Config
import * as Settings from "./settings";
import * as ConfigFile from "./config";
import { config } from "./config";
import { replaceAll, tableExists } from "./util";
//

// Event APIs
import { IBotCommand } from "./commandAPI";
import { IBotEvent } from "./eventAPI";
//

// Command Handlers
import { 
    loadAllCommands, 
    loadEvents, 
    handleEvent, 
    handleSetup, 
    handleCommand, 
    handleElevatedCommand
} from "./util";
//

// Bot Variable
const bot: Discord.Client = new Discord.Client();
//

// Declare, export, and load commands/events into memory
export let commands: IBotCommand[] = [];
export let elevated_commands: IBotCommand[] = [];
export let events: IBotEvent[] = [];
export let directory =  __dirname;

loadAllCommands(commands, elevated_commands, __dirname);
loadEvents(`${__dirname}/events`, events);
//

// On Ready Event
bot.on("ready", async () => {
    handleEvent(bot, "readyevent", events);
    handleEvent(bot, "robloxevent", events, bloxyClient);
});
//

// On Message Event
bot.on("message", async msg => {
    // If author is a bot
    if (msg.author.bot) return;
    
    // Check if main settings table exists. Allow only the setup command if not.
    if (msg.content.substring(2,7) == ('setup')) {
        handleSetup(msg, bot, elevated_commands);
        return;
    }

    // Handle the Message
    await handleEvent(bot, "messageevent", events, msg);

    // Global Prefix
    let globalPrefix = String(await Settings.readSetting('main_settings', `prefix`));

    // Handle commands
    if (msg.channel.type != "dm") {
        if (!msg.guild?.available) return;
        if (!await tableExists(`${msg.guild.id}_settings`)) return;
        // const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Local Prefix
        let localPrefix = String(await Settings.readSetting(`${msg.guild.id}_settings`, 'prefix'));
        const prefixRegex = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);

        if (!(msg.content.startsWith(localPrefix) || prefixRegex.test(msg.content)) && !(msg.content.substring(0,2) == (globalPrefix+globalPrefix))) return;
        // Ping
        (msg.content.toLowerCase() == localPrefix+"ping")
            ? msg.channel.send("Pong!")
            : handleCommand(bot, commands, msg);
    }else if (!(msg.content.substring(0,2) == (globalPrefix + globalPrefix))) {
        var prefix = String(await Settings.readSetting('main_settings','prefix'))
        var _embed = new Discord.MessageEmbed;

        _embed.setTitle('Error')
            .setDescription(`\`For security purposes, you are not allowed to run nonelevated commands through Direct Messages! \n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
            .setFooter(bot.user?.username,bot.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor([255,0,0]);

        msg.channel.send(_embed);
        return;
    }
    
    if (msg.content.substring(0,2) == (globalPrefix + globalPrefix)) {
        handleElevatedCommand(bot, elevated_commands, msg);
    }

    return;
});

bot.login(config.token);