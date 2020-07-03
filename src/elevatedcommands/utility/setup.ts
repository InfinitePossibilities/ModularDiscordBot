import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";

import * as Auth from "../../auth";
import * as Settings from "../../settings";
import { tableQuerys } from "../../config";
import { tableExists } from "../../util";
import { createTable } from "../../util";
import { CommandType } from "../../config";

class setup implements IBotCommand {
    private readonly _command = "setup";
    private readonly _help = "Test command. Does random things.";
    private readonly _usage = "setup";
    private readonly _isTest = true;
    private readonly _Type = CommandType.UTILITY;

    info = {
        command: (): string => { return this._command },
        help: (): string => { return this._help },
        usage: (): string => { return this._usage },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    } 

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // Authenticate
        if (await authenticate(msgObject, client)) { 

            let _embed = new Discord.MessageEmbed();

            let msg = msgObject.channel.send(_embed).then(m => { return (m as Discord.Message).id });

            let tableList = [
                "discord_logs",
                "group_logs"
            ];

            if (!await tableExists(`main_settings`) || !await tableListExists(tableList)) {
                if (!await tableExists(`main_settings`)) {
                    await createTable('main_settings', tableQuerys.main_settings, msgObject, _embed, msg);
                }

                var count = 0;
                
                let _finishedEmbed = new Discord.MessageEmbed();
                _finishedEmbed.setAuthor('Finished!')
                    .setDescription(':white_check_mark: All set up!')
                    .setColor([0,255,0])
                    .setTimestamp(new Date());

                tableList.forEach((table, i) => {
                    setTimeout(async () => {
                        if (!await tableExists(table)) {
                            await createTable('table', tableQuerys.logs(table), msgObject, _embed, msg);
                            count++;
                        }else {
                            count++;
                        }
                    }, i * 750);
                });

                setTimeout(async () => {
                    if (count == tableList.length) { msgObject.channel.messages.cache.get(await msg)?.edit(_finishedEmbed).then(m => { (m as Discord.Message).delete({timeout: 3000}); msgObject.delete({timeout: 3000}); }) };
                }, tableList.length * 750 + 1000);

            }else if (!await tableExists(`${msgObject.guild?.id}_settings`)) {
                if (msgObject.guild?.available) {
                    let _finishedEmbed = new Discord.MessageEmbed();
                    _finishedEmbed.setAuthor('Finished!')
                        .setDescription(':white_check_mark: All set up!')
                        .setColor([0,255,0])
                        .setTimestamp(new Date());

                    await createTable('table', tableQuerys.guild_settings(`${msgObject.guild?.id}_settings`), msgObject, _embed, msg);
                    
                    setTimeout(async () => {
                        msgObject.channel.messages.cache.get(await msg)?.edit(_finishedEmbed).then(m => { (m as Discord.Message).delete({timeout: 3000}); msgObject.delete({timeout: 3000}); });
                    }, 1000);
                }
            }else {

                let prefix = String(await Settings.readSetting('main_settings','prefix'));
                _embed.setTitle("Error!")
                    .setDescription(`\`All required Tables have already been created. \n\nIf you believe this is in error, use ${prefix+prefix}report to report an error.\``)
                    .setFooter(client.user?.username,client.user?.displayAvatarURL())
                    .setTimestamp(new Date())
                    .setColor([255,0,0]);
                msgObject.delete({timeout: 5000});
                msgObject.channel.messages.cache.get(await msg)?.edit(_embed).then(msg => { (msg as Discord.Message).delete({timeout: 5000}) });

            }
            
        };
    }
}

module.exports = setup;

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (await tableExists('main_settings')) {
        if (!(await Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings','prefix'));

            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix+prefix}error to report an error.\``)
                .setFooter(client.user?.username,client.user?.displayAvatarURL())
                .setTimestamp(new Date())
                .setColor([255,0,0]);
            
            msgObject.channel.send(_embed)
                .then(msg => {
                    (msg as Discord.Message).delete({timeout: 5000});
                    msgObject.delete({timeout: 5000});
                });

            return false;
        }else {
            return true;
        }
    }else { return true };
}

var tableListExists = async (tableList: string[]) => {
    for (var table in tableList) {
        if (!await tableExists(tableList[table])) {
            return false;
        }else { 
            continue; 
        }
    }
    return true;
};