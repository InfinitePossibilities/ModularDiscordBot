import * as Discord from "discord.js";
import { IBotCommand } from "../../commandAPI";
import * as Settings from "../../settings";
import * as Auth from "../../auth";
import * as Util from "../../util";
import { getDBConnection, tableExists } from "../../util";
import * as Config from "../../config";
import { CommandType, commandOverrides } from "../../config";

class settings implements IBotCommand {
    private readonly _command = "settings";
    private readonly _help = "Modifies various bot settings.";
    private readonly _usage = "settings [args]";
    private readonly _isTest = false;
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
        if (!await authenticate(msgObject, client)) return;

        // Decalre Variables
        var author = msgObject.author;
        var g = msgObject.guild;
        var _embed = new Discord.MessageEmbed();

        // Setup Embed
        _embed.setFooter(await Settings.readSetting(`${msgObject.guild?.id}_settings`,"botname"),client.user?.displayAvatarURL())
                .setTimestamp(new Date());

        // Config Keys
        var keys: string[] = [];
        var values: string[] = [];

        // Query database and add results to above variables
        var query = `SELECT * FROM \`${msgObject.guild?.id}_settings\``;

        await new Promise((resolve) => {
            getDBConnection().then((connection: any) => {
                connection.query(query, (err: any, result: any) => {
                    // If error, return error and cancel
                    if (err) { console.log(err) };
                    // Stringify and Parse result into array
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    // Get value of array
                    resolve(json);
                });
                connection.end();
            });
        }).then((keyPair: any) => {
            for (var i in keyPair) { keys.push(keyPair[i].key); values.push(keyPair[i].value); };
        });
        //

        // Determine whether or not to list settings
        if ((args.length == 0 || (args.length > 0 && args[0].toLowerCase() == `list`)) && msgObject.guild?.available) {
            if (msgObject.content.includes('--keep')) {
                msgObject.channel.send(await listSettings(keys,values,client,msgObject.guild,msgObject));
            }else {
                msgObject.delete();
                msgObject.channel.send(await listSettings(keys,values,client,msgObject.guild,msgObject)).then(msg => (msg as Discord.Message).delete({timeout: 15000}));
            }

        }else if (args.length > 1) {
            var args1 = args.slice(1).slice(1);

            for (var x in commandOverrides) {
                for (var y in args1) {
                    if (args1[y] == `--${commandOverrides[x]}`) {
                        args1.splice(Number(y),1);
                    }
                }
            }

            var argsJoined = args1.join(" ");

            // --
            let Override = args.includes("--override");
            
            if ((Config.config.localwhitelistedsettings.indexOf(args[1]) != -1 || Override) && msgObject.guild?.available) {
                switch (args[0]) {
                    case `list`: {
                        await Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`, _embed);

                        if (msgObject.content.includes('--keep')) {
                            msgObject.channel.send(await listSettings(keys,values,client,msgObject.guild,msgObject));
                        }else {
                            msgObject.delete();
                            msgObject.channel.send(await listSettings(keys,values,client,msgObject.guild,msgObject)).then(msg => (msg as Discord.Message).delete({timeout: 15000}));
                        }
                        break;
                    }
                    case `set`: {
                        msgObject.delete();
                        Settings.clearSetting(`${msgObject.guild?.id}_settings`,args[1]);
                        Settings.writeSetting(`${msgObject.guild?.id}_settings`,args[1] , argsJoined);
    
                        await Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`, _embed);

                        _embed.setAuthor(`Set`)
                                .setDescription(`Set \`${args[1]}\` to \`${argsJoined}\`!`);

                                Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`,_embed);
    
                        msgObject.channel.send(_embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
    
                        break;
                    }
                    case `add`: {
                        msgObject.delete();
                        Settings.addSetting(`${msgObject.guild?.id}_settings`, args[1] , argsJoined);
                        
                        await Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`, _embed);

                        _embed.setAuthor(`Add`)
                                .setDescription(`Added \`${argsJoined}\` to \`${args[1]}\`!`);

                        msgObject.channel.send(_embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
                        
                        break;
                    }
                    case `remove`: {
                        await Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`, _embed);

                        Settings.removeSetting(`${msgObject.guild?.id}_settings`, args[1], argsJoined);

                        _embed.setAuthor('Remove')
                                .setDescription(`Removed \`${argsJoined}\` from \`${args[1]}\`!`);

                        msgObject.channel.send(_embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
                        break;
                    }
                    case `clear`: {
                        msgObject.delete();
                        Settings.clearSetting(`${msgObject.guild?.id}_settings`, args[1]);

                        await Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`, _embed);

                        _embed.setAuthor(`Clear`)
                                .setDescription(`Successfully cleared \`${args[1]}\`!`);

                        msgObject.channel.send(_embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
                    }
                    default: {
    
                    }
                }
            }else {
                await Util.setMainEmbedColor(`${msgObject.guild?.id}_settings`, _embed);

                _embed.setAuthor(`Error!`)
                    .setDescription(`\`You are not authorized to change the following setting: ${args[1].toUpperCase()}\``);

                msgObject.channel.send(_embed).then(msg => (msg as Discord.Message).delete({timeout: 5000}));
            }
        }
    }
}

module.exports = settings;

let listSettings = async (keys: string[], values: string[], client: Discord.Client, guild: Discord.Guild, msgObject: Discord.Message): Promise<Discord.MessageEmbed> => {
    var _embed = new Discord.MessageEmbed();

    _embed.setAuthor("Current Localized Settings:")
        .setFooter(await Settings.readSetting(`${msgObject.guild?.id}_settings`,"botname"),client.user?.displayAvatarURL())
        .setTimestamp(new Date());

        await Util.setMainEmbedColor(`${guild.id}_settings`, _embed)

    for (var i = 0; i < keys.length; i++) {
       if (keys[i].toLowerCase() == "opted") continue;
        _embed.addField(`${keys[i].charAt(0).toUpperCase()+keys[i].slice(1)}`,`\`${values[i].replace(`null`,`Not Set`)}\``,true);
    }
    return _embed;
}

let authenticate = async (msgObject: Discord.Message, client: Discord.Client): Promise<boolean> => {
    if (await tableExists('main_settings') && msgObject.guild?.available) {
        if (!(await Auth.global.isDev(`main_settings`, msgObject.author) || await Auth.global.isGlobalAdmin(`main_settings`, msgObject.author) || await Auth.local.isLocalOwner(`${msgObject.guild?.id}_settings`, msgObject.author, msgObject.guild)) && !msgObject.author.bot) { //|| await Auth.local.isLocalAdmin(`${msgObject.guild?.id}_settings`, msgObject.author, msgObject.guild?)
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings','prefix'));

            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
                .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`,"botname"),client.user?.displayAvatarURL())
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
    }else { return false; };
}