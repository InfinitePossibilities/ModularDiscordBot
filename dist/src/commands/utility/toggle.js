"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Settings = require("../../settings");
const Auth = require("../../auth");
const util_1 = require("../../util");
const config_1 = require("../../config");
class toggle {
    constructor() {
        this._command = "toggle";
        this._help = "Toggles the bot on/off.";
        this._usage = "toggle";
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
            if (!await authenticate(msgObject, client))
                return;
            var embed = new Discord.MessageEmbed();
            embed.setAuthor('Status')
                .setFooter(await Settings.readSetting(`${(_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.id}_settings`, "botname"))
                .setTimestamp(new Date());
            if (await Settings.readSetting(`${(_b = msgObject.guild) === null || _b === void 0 ? void 0 : _b.id}_settings`, 'running') == 'true') {
                msgObject.delete();
                Settings.writeSetting(`${(_c = msgObject.guild) === null || _c === void 0 ? void 0 : _c.id}_settings`, 'running', 'false');
                embed.setDescription(`:x: Bot is now Offline.`)
                    .setColor([255, 0, 0]);
                msgObject.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));
                msgObject.author.send(embed);
            }
            else {
                msgObject.delete();
                Settings.writeSetting(`${(_d = msgObject.guild) === null || _d === void 0 ? void 0 : _d.id}_settings`, 'running', 'true');
                embed.setDescription(':white_check_mark: Bot is now Online.')
                    .setColor([90, 255, 87]);
                msgObject.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));
                msgObject.author.send(embed);
            }
        };
    }
}
module.exports = toggle;
let authenticate = async (msgObject, client) => {
    var _a, _b, _c, _d;
    if (await util_1.tableExists('main_settings') && ((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available)) {
        if (!(await Auth.global.isDev(`main_settings`, msgObject.author) || await Auth.global.isGlobalAdmin(`main_settings`, msgObject.author) || await Auth.local.isLocalOwner(`${(_b = msgObject.guild) === null || _b === void 0 ? void 0 : _b.id}_settings`, msgObject.author, msgObject.guild) || await Auth.local.isLocalAdmin(`${(_c = msgObject.guild) === null || _c === void 0 ? void 0 : _c.id}_settings`, msgObject.author, msgObject.guild)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
                .setFooter(await Settings.readSetting(`${msgObject.guild.id}_settings`, "botname"), (_d = client.user) === null || _d === void 0 ? void 0 : _d.displayAvatarURL())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL3V0aWxpdHkvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBR3RDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFFbkMscUNBQXlDO0FBQ3pDLHlDQUEyQztBQUUzQyxNQUFNLE1BQU07SUFBWjtRQUNxQixhQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3BCLFVBQUssR0FBRyx5QkFBeUIsQ0FBQztRQUNsQyxXQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ2xCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLElBQUksRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFOztZQUVyRyxJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPO1lBRW5ELElBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXZDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2lCQUNwQixTQUFTLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBQSxTQUFTLENBQUMsS0FBSywwQ0FBRSxFQUFFLFdBQVcsRUFBQyxTQUFTLENBQUMsQ0FBQztpQkFDbEYsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztZQUU5QixJQUFJLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLE1BQUEsU0FBUyxDQUFDLEtBQUssMENBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLElBQUksTUFBTSxFQUFFO2dCQUNwRixTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25CLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFBLFNBQVMsQ0FBQyxLQUFLLDBDQUFFLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0UsS0FBSyxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQztxQkFDMUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBRSxHQUF1QixDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hDO2lCQUFLO2dCQUNGLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkIsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLE1BQUEsU0FBUyxDQUFDLEtBQUssMENBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1RSxLQUFLLENBQUMsY0FBYyxDQUFDLHVDQUF1QyxDQUFDO3FCQUN4RCxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLEdBQXVCLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEM7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0NBQUE7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUV4QixJQUFJLFlBQVksR0FBRyxLQUFLLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFvQixFQUFFOztJQUM5RixJQUFJLE1BQU0sa0JBQVcsQ0FBQyxlQUFlLENBQUMsV0FBSSxTQUFTLENBQUMsS0FBSywwQ0FBRSxTQUFTLENBQUEsRUFBRTtRQUNsRSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFBLFNBQVMsQ0FBQyxLQUFLLDBDQUFFLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFBLFNBQVMsQ0FBQyxLQUFLLDBDQUFFLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUM1VyxJQUFJLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUNwQixjQUFjLENBQUMseUZBQXlGLE1BQU0sNkJBQTZCLENBQUM7aUJBQzVJLFNBQVMsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxFQUFDLFNBQVMsQ0FBQyxRQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLGdCQUFnQixHQUFHO2lCQUNqSCxZQUFZLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztpQkFDeEIsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpCLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ1AsR0FBdUIsQ0FBQyxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztnQkFDakQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBRVAsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFBSztZQUNGLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7S0FDSjtTQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7S0FBRTtJQUFBLENBQUM7QUFDNUIsQ0FBQyxDQUFBIn0=