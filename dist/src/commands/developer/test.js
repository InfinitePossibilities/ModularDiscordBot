"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Auth = require("../../auth");
const Settings = require("../../settings");
const util_1 = require("../../util");
const config_1 = require("../../config");
class test {
    constructor() {
        this._command = "test";
        this._help = "Test command. Does random things.";
        this._usage = "command [args]";
        this._isTest = true;
        this._Type = config_1.CommandType.DEVELOPER;
        this.info = {
            command: () => { return this._command; },
            help: () => { return this._help; },
            usage: () => { return this._usage; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            // Authenticate
            if (!await authenticate(msgObject, client))
                return;
            // if (msgObject.member) {
            //     (msgObject.channel as Discord.TextChannel).permissionsFor(msgObject.member)?.has("ADMINISTRATOR");
            // }
            var list = new Array();
            var itemsPerPage = 10;
            var currentPage = 1;
            var pageCount = 0;
            // Create List
            var length = 30;
            for (var i = 1; i <= length; i++) {
                list.push(i);
            }
            console.log(list);
            pageCount = Math.ceil(list.length / itemsPerPage);
            for (var i = 1; i <= pageCount; i++) {
                var begin = (currentPage - 1) * itemsPerPage;
                var end = begin + itemsPerPage;
                var pageItems = list.slice(begin, end);
                console.log("PAGE " + currentPage);
                console.log(pageItems.join("\n"));
                currentPage++;
            }
        };
    }
}
module.exports = test;
let authenticate = async (msgObject, client) => {
    var _a, _b, _c;
    if (await util_1.tableExists('main_settings') && ((_a = msgObject.guild) === null || _a === void 0 ? void 0 : _a.available)) {
        if (!(Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
            var _embed = new Discord.MessageEmbed();
            var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
            _embed.setTitle("Error!")
                .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
                .setFooter((_b = client.user) === null || _b === void 0 ? void 0 : _b.username, (_c = client.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9kZXZlbG9wZXIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUV0QyxtQ0FBbUM7QUFDbkMsMkNBQTJDO0FBQzNDLHFDQUF5QztBQUN6Qyx5Q0FBbUQ7QUFHbkQsTUFBTSxJQUFJO0lBQVY7UUFDcUIsYUFBUSxHQUFHLE1BQU0sQ0FBQztRQUNsQixVQUFLLEdBQUcsbUNBQW1DLENBQUM7UUFDNUMsV0FBTSxHQUFHLGdCQUFnQixDQUFDO1FBQzFCLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFDZixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxTQUFTLENBQUM7UUFFL0MsU0FBSSxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDL0MsSUFBSSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7WUFDekMsS0FBSyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLEdBQWdCLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1NBQ2pELENBQUE7UUFFRCxlQUFVLEdBQUcsS0FBSyxFQUFFLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQWlCLEVBQUU7WUFDckcsZUFBZTtZQUNmLElBQUksQ0FBQyxNQUFNLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO2dCQUFFLE9BQU87WUFFbkQsMEJBQTBCO1lBQzFCLHlHQUF5RztZQUN6RyxJQUFJO1lBRUosSUFBSSxJQUFJ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