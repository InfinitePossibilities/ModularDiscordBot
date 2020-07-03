"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Auth = require("../../auth");
const Settings = require("../../settings");
const config_1 = require("../../config");
const util_1 = require("../../util");
const util_2 = require("../../util");
const config_2 = require("../../config");
class setup {
    constructor() {
        this._command = "setup";
        this._help = "Test command. Does random things.";
        this._usage = "setup";
        this._isTest = true;
        this._Type = config_2.CommandType.UTILITY;
        this.info = {
            command: () => { return this._command; },
            help: () => { return this._help; },
            usage: () => { return this._usage; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            var _a, _b, _c, _d, _e, _f;
            // Authenticate
            if (await authenticate(msgObject, client)) {
                let _embed = new Discord.MessageEmbed();
                let msg = msgObject.channel.send(_embed).then(m => { return m.id; });
                let tableList = [
                    "discord_logs",
                    "group_logs"
                ];
                if (!await util_1.tableExists(`main_settings`) || !await tableListExists(tableList)) {
                    if (!await util_1.tableExists(`main_settings`)) {
                        await util_2.createTable('main_settings', config_1.tableQuerys.main_settings, msgObject, _embed, msg);
                    }
                    var count = 0;
                    let _finishedEmbed = new Discord.MessageEmbed();
                    _finishedEmbed.setAuthor('Finished!')
                        .setDescription(':white_check_mark: All set up!')
                        .setColor([0, 255, 0])
                        .setTimestamp(new Date());
                    tableList.forEach((table, i) => {
                        setTimeout(async () => {
                            if (!await util_1.tableExists(table)) {
                                await util_2.createTable('table', config_1.tableQuerys.logs(table), msgObject, _embed, msg);
                                count++;
                            }
                            else {
                                count++;
                            }
                        }, i * 750);
                    });
                    setTimeout(async () => {
                        var _a;
                        if (count == tableList.length) {
                            (_a = msgObject.channel.messages.cache.get(await msg)) === null || _a === void 0 ? void 0 : _a.edit(_finishedEmbed).then(m => { m.delete({ timeout: 3000 }); msgObject.delete({ timeout: 3000 }); });
                        }
                        ;
                    }, tableList.length * 750 + 1000);
                }
                else if (!await util_1.tableExists(`${(_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.id}_settings`)) {
                    if ((_b = msgObject.guild) === null || _b === void 0 ? void 0 : _b.available) {
                        let _finishedEmbed = new Discord.MessageEmbed();
                        _finishedEmbed.setAuthor('Finished!')
                            .setDescription(':white_check_mark: All set up!')
                            .setColor([0, 255, 0])
                            .setTimestamp(new Date());
                        await util_2.createTable('table', config_1.tableQuerys.guild_settings(`${(_c = msgObject.guild) === null || _c === void 0 ? void 0 : _c.id}_settings`), msgObject, _embed, msg);
                        setTimeout(async () => {
                            var _a;
                            (_a = msgObject.channel.messages.cache.get(await msg)) === null || _a === void 0 ? void 0 : _a.edit(_finishedEmbed).then(m => { m.delete({ timeout: 3000 }); msgObject.delete({ timeout: 3000 }); });
                        }, 1000);
                    }
                }
                else {
                    let prefix = String(await Settings.readSetting('main_settings', 'prefix'));
                    _embed.setTitle("Error!")
                        .setDescription(`\`All required Tables have already been created. \n\nIf you believe this is in error, use ${prefix + prefix}report to report an error.\``)
                        .setFooter((_d = client.user) === null || _d === void 0 ? void 0 : _d.username, (_e = client.user) === null || _e === void 0 ? void 0 : _e.displayAvatarURL())
                        .setTimestamp(new Date())
                        .setColor([255, 0, 0]);
                    msgObject.delete({ timeout: 5000 });
                    (_f = msgObject.channel.messages.cache.get(await msg)) === null || _f === void 0 ? void 0 : _f.edit(_embed).then(msg => { msg.delete({ timeout: 5000 }); });
                }
            }
            ;
        };
    }
}
module.exports = setup;
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (await util_1.tableExists('main_settings')) {
        if (!(await Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix + prefix}error to report an error.\``)
                .setFooter((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL())
                .setTimestamp(new Date())
                .setColor([255, 0, 0]);
            msgObject.channel.send(_embed)
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
        return true;
    }
    ;
};
var tableListExists = async (tableList) => {
    for (var table in tableList) {
        if (!await util_1.tableExists(tableList[table])) {
            return false;
        }
        else {
            continue;
        }
    }
    return true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZWxldmF0ZWRjb21tYW5kcy91dGlsaXR5L3NldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBR3RDLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFDM0MseUNBQTJDO0FBQzNDLHFDQUF5QztBQUN6QyxxQ0FBeUM7QUFDekMseUNBQTJDO0FBRTNDLE1BQU0sS0FBSztJQUFYO1FBQ3FCLGFBQVEsR0FBRyxPQUFPLENBQUM7UUFDbkIsVUFBSyxHQUFHLG1DQUFtQyxDQUFDO1FBQzVDLFdBQU0sR0FBRyxPQUFPLENBQUM7UUFDakIsWUFBTyxHQUFHLElBQUksQ0FBQztRQUNmLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTs7WUFDckcsZUFBZTtZQUNmLElBQUksTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUV2QyxJQUFJLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFFeEMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBUSxDQUFxQixDQUFDLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6RixJQUFJLFNBQVMsR0FBRztvQkFDWixjQUFjO29CQUNkLFlBQVk7aUJBQ2YsQ0FBQztnQkFFRixJQUFJLENBQUMsTUFBTSxrQkFBVyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxlQUFlLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQzFFLElBQUksQ0FBQyxNQUFNLGtCQUFXLENBQUMsZUFBZSxDQUFDLEVBQUU7d0JBQ3JDLE1BQU0sa0JBQVcsQ0FBQyxlQUFlLEVBQUUsb0JBQVcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDekY7b0JBRUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUVkLElBQUksY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNoRCxjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQzt5QkFDaEMsY0FBYyxDQUFDLGdDQUFnQyxDQUFDO3lCQUNoRCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNuQixZQUFZLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUU5QixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMzQixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7NEJBQ2xCLElBQUksQ0FBQyxNQUFNLGtCQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQzNCLE1BQU0sa0JBQVcsQ0FBQyxPQUFPLEVBQUUsb0JBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQ0FDNUUsS0FBSyxFQUFFLENBQUM7NkJBQ1g7aUNBQUs7Z0NBQ0YsS0FBSyxFQUFFLENBQUM7NkJBQ1g7d0JBQ0wsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFOzt3QkFDbEIsSUFBSSxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTs0QkFBRSxNQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsMENBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBSSxDQUFxQixDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO3lCQUFFO3dCQUFBLENBQUM7b0JBQy9NLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFFckM7cUJBQUssSUFBSSxDQUFDLE1BQU0sa0JBQVcsQ0FBQyxHQUFHLE1BQUEsU0FBUyxDQUFDLEtBQUssMENBQUUsRUFBRSxXQUFXLENBQUMsRUFBRTtvQkFDN0QsVUFBSSxTQUFTLENBQUMsS0FBSywwQ0FBRSxTQUFTLEVBQUU7d0JBQzVCLElBQUksY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNoRCxjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQzs2QkFDaEMsY0FBYyxDQUFDLGdDQUFnQyxDQUFDOzZCQUNoRCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNuQixZQUFZLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO3dCQUU5QixNQUFNLGtCQUFXLENBQUMsT0FBTyxFQUFFLG9CQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsTUFBQSxTQUFTLENBQUMsS0FBSywwQ0FBRSxFQUFFLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWxILFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTs7NEJBQ2xCLE1BQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQywwQ0FBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFJLENBQXFCLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDWjtpQkFDSjtxQkFBSztvQkFFRixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMxRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQzt5QkFDcEIsY0FBYyxDQUFDLDZGQUE2RixNQUFNLEdBQUMsTUFBTSw4QkFBOEIsQ0FBQzt5QkFDeEosU0FBUyxPQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLFFBQVEsUUFBQyxNQUFNLENBQUMsSUFBSSwwQ0FBRSxnQkFBZ0IsR0FBRzt5QkFDaEUsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7eUJBQ3hCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO29CQUNsQyxNQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsMENBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBSSxHQUF1QixDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxFQUFFO2lCQUVuSTthQUVKO1lBQUEsQ0FBQztRQUNOLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBRXZCLElBQUksWUFBWSxHQUFHLEtBQUssRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQW9CLEVBQUU7O0lBQzlGLElBQUksTUFBTSxrQkFBVyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1FBQ3BDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDeEYsSUFBSSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUUxRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDcEIsY0FBYyxDQUFDLHlGQUF5RixNQUFNLEdBQUMsTUFBTSw2QkFBNkIsQ0FBQztpQkFDbkosU0FBUyxPQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLFFBQVEsUUFBQyxNQUFNLENBQUMsSUFBSSwwQ0FBRSxnQkFBZ0IsR0FBRztpQkFDaEUsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7aUJBQ3hCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6QixTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDUCxHQUF1QixDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2dCQUNqRCxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUM7WUFFUCxPQUFPLEtBQUssQ0FBQztTQUNoQjthQUFLO1lBQ0YsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO1NBQUs7UUFBRSxPQUFPLElBQUksQ0FBQTtLQUFFO0lBQUEsQ0FBQztBQUMxQixDQUFDLENBQUE7QUFFRCxJQUFJLGVBQWUsR0FBRyxLQUFLLEVBQUUsU0FBbUIsRUFBRSxFQUFFO0lBQ2hELEtBQUssSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO1FBQ3pCLElBQUksQ0FBQyxNQUFNLGtCQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDdEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFBSztZQUNGLFNBQVM7U0FDWjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDIn0=