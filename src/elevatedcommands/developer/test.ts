import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
// var roblox = require('noblox.js');
// var Bloxy = require('devbloxy');

import { getDBConnection } from "../../util";

import * as Config from "../../config";
import * as Auth from "../../auth";
import * as Settings from "../../settings";
import { CommandType } from "../../config";

class test implements IBotCommand {
    private readonly _command = "test";
    private readonly _help = "Test command. Does random things.";
    private readonly _usage = "command [args]";
    private readonly _isTest = false;
    private readonly _Type = CommandType.DEVELOPER;

    info = {
        command: (): string => { return this._command },
        help: (): string => { return this._help },
        usage: (): string => { return this._usage },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // Authenticate
        if (!await authenticate(msgObject, client)) return;

        // Run test code
        console.log('Test')

    }
}

module.exports = test;

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (!(Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
        var _embed = new Discord.MessageEmbed();
        var prefix = String(await Settings.readSetting('main_settings','prefix'));

        _embed.setTitle("Error!")
            .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
            .setFooter(client.user?.username,client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor([255,0,0]);
        
        await msgObject.channel.send(_embed)
            .then(msg => {
                (msg as Discord.Message).delete({timeout: 5000});
                msgObject.delete({timeout: 5000});
            });

        return false;
    }else {
        return true;
    }
}