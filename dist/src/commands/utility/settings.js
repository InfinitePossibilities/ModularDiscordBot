"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Settings = require("../../settings");
const Auth = require("../../auth");
const Util = require("../../util");
const util_1 = require("../../util");
const Config = require("../../config");
const config_1 = require("../../config");
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            // Authenticate
            if (!await authenticate(msgObject, client))
                return;
            // Decalre Variables
            var author = msgObject.author;
            var g = msgObject.guild;
            var _embed = new Discord.MessageEmbed();
            // Setup Embed
            _embed.setFooter(await Settings.readSetting(`${(_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.id}_settings`, "botname"), (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
                .setTimestamp(new Date());
            // Config Keys
            var keys = [];
            var values = [];
            // Query database and add results to above variables
            var query = `SELECT * FROM \`${(_c = msgObject.guild) === null || _c === void 0 ? void 0 : _c.id}_settings\``;
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
            if ((args.length == 0 || (args.length > 0 && args[0].toLowerCase() == `list`)) && ((_d = msgObject.guild) === null || _d === void 0 ? void 0 : _d.available)) {
                if (msgObject.content.includes('--keep')) {
                    msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild, msgObject));
                }
                else {
                    msgObject.delete();
                    msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild, msgObject)).then(msg => msg.delete({ timeout: 15000 }));
                }
            }
            else if (args.length > 1) {
                var args1 = args.slice(1).slice(1);
                for (var x in config_1.commandOverrides) {
                    for (var y in args1) {
                        if (args1[y] == `--${config_1.commandOverrides[x]}`) {
                            args1.splice(Number(y), 1);
                        }
                    }
                }
                var argsJoined = args1.join(" ");
                // --
                let Override = args.includes("--override");
                if ((Config.config.localwhitelistedsettings.indexOf(args[1]) != -1 || Override) && ((_e = msgObject.guild) === null || _e === void 0 ? void 0 : _e.available)) {
                    switch (args[0]) {
                        case `list`: {
                            await Util.setMainEmbedColor(`${(_f = msgObject.guild) === null || _f === void 0 ? void 0 : _f.id}_settings`, _embed);
                            if (msgObject.content.includes('--keep')) {
                                msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild, msgObject));
                            }
                            else {
                                msgObject.delete();
                                msgObject.channel.send(await listSettings(keys, values, client, msgObject.guild, msgObject)).then(msg => msg.delete({ timeout: 15000 }));
                            }
                            break;
                        }
                        case `set`: {
                            msgObject.delete();
                            Settings.clearSetting(`${(_g = msgObject.guild) === null || _g === void 0 ? void 0 : _g.id}_settings`, args[1]);
                            Settings.writeSetting(`${(_h = msgObject.guild) === null || _h === void 0 ? void 0 : _h.id}_settings`, args[1], argsJoined);
                            await Util.setMainEmbedColor(`${(_j = msgObject.guild) === null || _j === void 0 ? void 0 : _j.id}_settings`, _embed);
                            _embed.setAuthor(`Set`)
                                .setDescription(`Set \`${args[1]}\` to \`${argsJoined}\`!`);
                            Util.setMainEmbedColor(`${(_k = msgObject.guild) === null || _k === void 0 ? void 0 : _k.id}_settings`, _embed);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        case `add`: {
                            msgObject.delete();
                            Settings.addSetting(`${(_l = msgObject.guild) === null || _l === void 0 ? void 0 : _l.id}_settings`, args[1], argsJoined);
                            await Util.setMainEmbedColor(`${(_m = msgObject.guild) === null || _m === void 0 ? void 0 : _m.id}_settings`, _embed);
                            _embed.setAuthor(`Add`)
                                .setDescription(`Added \`${argsJoined}\` to \`${args[1]}\`!`);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        case `remove`: {
                            await Util.setMainEmbedColor(`${(_o = msgObject.guild) === null || _o === void 0 ? void 0 : _o.id}_settings`, _embed);
                            Settings.removeSetting(`${(_p = msgObject.guild) === null || _p === void 0 ? void 0 : _p.id}_settings`, args[1], argsJoined);
                            _embed.setAuthor('Remove')
                                .setDescription(`Removed \`${argsJoined}\` from \`${args[1]}\`!`);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        case `clear`: {
                            msgObject.delete();
                            Settings.clearSetting(`${(_q = msgObject.guild) === null || _q === void 0 ? void 0 : _q.id}_settings`, args[1]);
                            await Util.setMainEmbedColor(`${(_r = msgObject.guild) === null || _r === void 0 ? void 0 : _r.id}_settings`, _embed);
                            _embed.setAuthor(`Clear`)
                                .setDescription(`Successfully cleared \`${args[1]}\`!`);
                            msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                        }
                        default: {
                        }
                    }
                }
                else {
                    await Util.setMainEmbedColor(`${(_s = msgObject.guild) === null || _s === void 0 ? void 0 : _s.id}_settings`, _embed);
                    _embed.setAuthor(`Error!`)
                        .setDescription(`\`You are not authorized to change the following setting: ${args[1].toUpperCase()}\``);
                    msgObject.channel.send(_embed).then(msg => msg.delete({ timeout: 5000 }));
                }
            }
        };
    }
}
module.exports = settings;
let listSettings = async (keys, values, client, guild, msgObject) => {
    var _a, _b;
    var _embed = new Discord.MessageEmbed();
    _embed.setAuthor("Current Localized Settings:")
        .setFooter(await Settings.readSetting(`${(_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.id}_settings`, "botname"), (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
        .setTimestamp(new Date());
    await Util.setMainEmbedColor(`${guild.id}_settings`, _embed);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() == "opted")
            continue;
        _embed.addField(`${keys[i].charAt(0).toUpperCase() + keys[i].slice(1)}`, `\`${values[i].replace(`null`, `Not Set`)}\``, true);
    }
    return _embed;
};
let authenticate = async (msgObject, client) => {
    var _a, _b, _c;
    if (await util_1.tableExists('main_settings') && ((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available)) {
        if (!(await Auth.global.isDev(`main_settings`, msgObject.author) || await Auth.global.isGlobalAdmin(`main_settings`, msgObject.author) || await Auth.local.isLocalOwner(`${(_b = msgObject.guild) === null || _b === void 0 ? void 0 : _b.id}_settings`, msgObject.author, msgObject.guild)) && !msgObject.author.bot) { //|| await Auth.local.isLocalAdmin(`${msgObject.guild?.id}_settings`, msgObject.author, msgObject.guild?)
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
                .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`, "botname"), (_c = client.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvdXRpbGl0eS9zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0QywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLG1DQUFtQztBQUNuQyxxQ0FBMEQ7QUFDMUQsdUNBQXVDO0FBQ3ZDLHlDQUE2RDtBQUU3RCxNQUFNLFFBQVE7SUFBZDtRQUNxQixhQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3RCLFVBQUssR0FBRyxnQ0FBZ0MsQ0FBQztRQUN6QyxXQUFNLEdBQUcsaUJBQWlCLENBQUM7UUFDM0IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxPQUFPLENBQUM7UUFFN0MsU0FBSSxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDL0MsSUFBSSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7WUFDekMsS0FBSyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLEdBQWdCLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1NBQ2pELENBQUE7UUFFRCxlQUFVLEdBQUcsS0FBSyxFQUFFLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQWlCLEVBQUU7O1lBQ3JHLGVBQWU7WUFDZixJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELG9CQUFvQjtZQUNw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