import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import * as Auth from "../../auth";
import * as Settings from "../../settings";
import { tableExists } from "../../util";
import { CommandType, config } from "../../config";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

class test implements IBotCommand {
    private readonly _command = "test";
    private readonly _help = "Test command. Does random things.";
    private readonly _usage = "command [args]";
    private readonly _isTest = true;
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
        
        // if (msgObject.member) {
        //     (msgObject.channel as Discord.TextChannel).permissionsFor(msgObject.member)?.has("ADMINISTRATOR");
        // }

        var list = new Array();
        var itemsPerPage = 10;
        var currentPage = 1;
        var pageCount = 0;

        // Create List
        var length = 30
        for (var i = 1; i <= length; i++) {
            list.push(i);
        }
        console.log(list)
        
        pageCount = Math.ceil(list.length / itemsPerPage);

        for (var i = 1; i <= pageCount; i++) {
            var begin = (currentPage - 1) * itemsPerPage;
            var end = begin + itemsPerPage;
            var pageItems = list.slice(begin, end);

            console.log("PAGE " + currentPage)
            console.log(pageItems.join("\n"));
            currentPage++
        }
    }
}

module.exports = test;

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (await tableExists('main_settings') && msgObject.guild?.available) {
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
    }else {return false; };
}