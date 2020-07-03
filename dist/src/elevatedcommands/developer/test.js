"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Auth = require("../../auth");
const Settings = require("../../settings");
const config_1 = require("../../config");
class test {
    constructor() {
        this._command = "test";
        this._help = "Test command. Does random things.";
        this._usage = "command [args]";
        this._isTest = false;
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
            // Run test code
            console.log('Test');
        };
    }
}
module.exports = test;
let authenticate = async (msgObject, client) => {
    var _a, _b;
    if (!(Auth.global.isDev('main_settings', msgObject.author)) && !msgObject.author.bot) {
        var _embed = new Discord.MessageEmbed();
        var prefix = String(await Settings.readSetting('main_settings', 'prefix'));
        _embed.setTitle("Error!")
            .setDescription(`\`You are not authorized to use this command!\n\nIf you believe this is in error, use ${prefix}error to report an error.\``)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9lbGV2YXRlZGNvbW1hbmRzL2RldmVsb3Blci90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBUXRDLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFDM0MseUNBQTJDO0FBRTNDLE1BQU0sSUFBSTtJQUFWO1FBQ3FCLGFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEIsVUFBSyxHQUFHLG1DQUFtQyxDQUFDO1FBQzVDLFdBQU0sR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLFNBQVMsQ0FBQztRQUUvQyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxJQUFJLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDakQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyxlQUFlO1lBQ2YsSUFBSSxDQUFDLE1BQU0sWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQUUsT0FBTztZQUVuRCxnQkFBZ0I7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV2QixDQUFDLENBQUE7SUFDTCxDQUFDO0NBQUE7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUV0QixJQUFJLFlBQVksR0FBRyxLQUFLLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFvQixFQUFFOztJQUM5RixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNsRixJQUFJLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRTFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyx5RkFBeUYsTUFBTSw2QkFBNkIsQ0FBQzthQUM1SSxTQUFTLE9BQUMsTUFBTSxDQUFDLElBQUksMENBQUUsUUFBUSxRQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLGdCQUFnQixHQUFHO2FBQ2hFLFlBQVksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO2FBQ3hCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDUCxHQUF1QixDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ2pELFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUVQLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO1NBQUs7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0FBQ0wsQ0FBQyxDQUFBIn0=