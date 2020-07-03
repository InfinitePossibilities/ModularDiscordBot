"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Settings = require("../../settings");
const Auth = require("../../auth");
const Util = require("../../util");
const util_1 = require("../../util");
const config_1 = require("../../config");
const Config = require("../../config");
const config_2 = require("../../config");
class settings {
    constructor() {
        this._command = "settings";
        this._help = "Modifies various bot settings.";
        this._usage = "settings [args]";
        this._isTest = false;
        this._Type = config_1.CommandType.UTILITY;
        this.info = {
            command: () => { return this._command; },
            help: () => { return this._help; },
            usage: () => { return this._usage; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            var _a, _b, _c, _d;
            // Authenticate
            if (!await authenticate(msgObject, client))
                return;
            // Decalre Variables
            var author = msgObject.author;
            var g = msgObject.guild;
            var _embed = new Discord.MessageEmbed();
            // Setup Embed
            _embed.setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
                .setTimestamp(new Date());
            // Config Keys
            var keys = [];
            var values = [];
            // Query database and add results to above variables
            var query = `SELECT * FROM \`main_settings\``;
            await new Promise((resolve) => {
                util_1.getDBConnection().then((connection) => {
                    connection.query(query, (err, result) => {
                        // If error, return error and cancel
                        if (err) {
                            console.log(err);
                        }
                        ;
                        // Stringify and Parse result into array
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        // Get value of array
                        resolve(json);
                    });
                    connection.end();
                });
            }).then((keyPair) => {
                for (var i in keyPair) {
                    keys.push(keyPair[i].key);
                    values.push(keyPair[i].value);
                }
                ;
            });
            //
            // Determine whether or not to list settings
            if ((args.length == 0 || (args.length > 0 && args[0].toLowerCase() == `list`)) && ((_c = msgObject.guild) === null || _c === void 0 ? void 0 : _c.available)) {
                if (msgObject.content.includes('--keep')) {
                    msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild));
                }
                else {
                    msgObject.delete();
                    msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild)).then(msg => msg.delete({ timeout: 15000 }));
                }
            }
            else if (args.length > 1) {
                var args1 = args.slice(1).slice(1);
                for (var x in config_2.commandOverrides) {
                    for (var y in args1) {
                        if (args1[y] == `--${config_2.commandOverrides[x]}`) {
                            args1.splice(Number(y), 1);
                        }
                    }
                }
                var argsJoined = args1.join(" ");
                // --
                let Override = args.includes("--override");
                if ((Config.config.localwhitelistedsettings.indexOf(args[1]) != -1 || Override) && ((_d = msgObject.guild) === null || _d === void 0 ? void 0 : _d.available)) {
                    switch (args[0]) {
                        case `list`: {
                            await Util.setMainEmbedColor(`main_settings`, _embed);
                            if (msgObject.content.includes('--keep')) {
                                msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild));
                            }
                            else {
                                msgObject.delete();
                                msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild)).then(msg => msg.delete({ timeout: 15000 }));
                            }
                            break;
                        }
                        case `set`: {
                            msgObject.delete();
                            Settings.clearSetting(`main_settings`, args[1]);
                            Settings.writeSetting(`main_settings`, args[1], argsJoined);
                            await Util.setMainEmbedColor(`main_settings`, _embed);
                            _embed.setAuthor(`Set`)
                                .setDescription(`Set \`${args[1]}\` to \`${argsJoined}\`!`);
                            Util.setMainEmbedColor(`main_settings`, _embed);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        case `add`: {
                            msgObject.delete();
                            Settings.addSetting(`main_settings`, args[1], argsJoined);
                            await Util.setMainEmbedColor(`main_settings`, _embed);
                            _embed.setAuthor(`Add`)
                                .setDescription(`Added \`${argsJoined}\` to \`${args[1]}\`!`);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        case `remove`: {
                            await Util.setMainEmbedColor(`main_settings`, _embed);
                            Settings.removeSetting(`main_settings`, args[1], argsJoined);
                            _embed.setAuthor('Remove')
                                .setDescription(`Removed \`${argsJoined}\` from \`${args[1]}\`!`);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        case `clear`: {
                            msgObject.delete();
                            Settings.clearSetting(`main_settings`, args[1]);
                            await Util.setMainEmbedColor(`main_settings`, _embed);
                            _embed.setAuthor(`Clear`)
                                .setDescription(`Successfully cleared \`${args[1]}\`!`);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                        }
                        default: {
                        }
                    }
                }
                else {
                    await Util.setMainEmbedColor(`main_settings`, _embed);
                    _embed.setAuthor(`Error!`)
                        .setDescription(`\`You are not authorized to change the following setting: ${args[1].toUpperCase()}\``);
                    msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                }
            }
        };
    }
}
module.exports = settings;
let listSettings = async (keys, values, client, guild) => {
    var _a, _b;
    var _embed = new Discord.MessageEmbed();
    _embed.setAuthor("Current Globalized Settings:")
        .setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
        .setTimestamp(new Date());
    await Util.setMainEmbedColor(`main_settings`, _embed);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() == "opted")
            continue;
        _embed.addField(`${keys[i].charAt(0).toUpperCase() + keys[i].slice(1)}`, `\`${values[i].replace(`'null'`, `Not Set`)}\``, true);
    }
    return _embed;
};
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (!(await Auth.global.isDev(`main_settings`, msgObject.author) || await Auth.global.isGlobalAdmin(`main_settings`, msgObject.author)) && !msgObject.author.bot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZWxldmF0ZWRjb21tYW5kcy91dGlsaXR5L3NldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBR3RDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsbUNBQW1DO0FBQ25DLHFDQUE2QztBQUM3Qyx5Q0FBMkM7QUFDM0MsdUNBQXVDO0FBQ3ZDLHlDQUFnRDtBQUVoRCxNQUFNLFFBQVE7SUFBZDtRQUNxQixhQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3RCLFVBQUssR0FBRyxnQ0FBZ0MsQ0FBQztRQUN6QyxXQUFNLEdBQUcsaUJBQWlCLENBQUM7UUFDM0IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxPQUFPLENBQUM7UUFFN0MsU0FBSSxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDL0MsSUFBSSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7WUFDekMsS0FBSyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLEdBQWdCLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1NBQ2pELENBQUE7UUFFRCxlQUFVLEdBQUcsS0FBSyxFQUFFLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQWlCLEVBQUU7O1lBQ3JHLGVBQWU7WUFDZixJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxP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