"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableQuerys = exports.commandOverrides = exports.EventType = exports.CommandType = exports.config = void 0;
const ConfidentialFile = require("../confidential");
var Confidential = ConfidentialFile.Confidential;
exports.config = {
    // Database Information
    "host": Confidential.host,
    "username": Confidential.username,
    "password": Confidential.password,
    "database": Confidential.database,
    // Bot Token
    "token": Confidential.token,
    // Local settings that can be altered by command
    "localwhitelistedsettings": [
        "running",
        "prefix",
        "botname",
        "maincolor",
    ],
    // Global settings that can be altered by command
    "globalwhitelistedsettings": [
        "running",
        "prefix",
        "maincolor",
        "usersblacklisted"
    ]
};
var CommandType;
(function (CommandType) {
    CommandType["GENERAL"] = "GENERAL";
    CommandType["UTILITY"] = "UTILITY";
    CommandType["DEVELOPER"] = "DEVELOPER";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
var EventType;
(function (EventType) {
    EventType["CORE"] = "CORE";
    EventType["GENERAL"] = "GENERAL";
})(EventType = exports.EventType || (exports.EventType = {}));
exports.commandOverrides = [
    "keep",
    "override"
];
exports.tableQuerys = {
    guild_settings: (table) => {
        return [
            [`CREATE TABLE \`${Confidential.database}\`.\`${table}\` ( 
            \`key\` TEXT NULL DEFAULT NULL , 
            \`value\` TEXT NULL DEFAULT NULL ) 
            ENGINE = InnoDB;`,
                'Creating guild table . . .'],
            [`INSERT INTO \`${table}\` 
            (\`key\`, \`value\`) VALUES 
                ('running','true'),
                ('prefix','-'),
                ('botName','Test Bot'),
                ('mainColor',''),
                ('ownerroles',''),
                ('adminroles',''),
                ('modroles',''),

                ('doAutoAnnounce','false'),
                ('announceChannels',''),
                ('doChannelLog','false'),
                ('logChannels',''),

                ('roleAnnounceBlacklist',''),
                ('requestBlacklisted',''),
                ('usersBlacklisted',''),

                ('robloxEnabled','false'),
                ('protectees',''),
                ('robloxGroup',''),
                ('opted','');`,
                'Inserting Default Settings . . .'] // {'userid','priority','rank'}
        ];
    },
    main_settings: [
        [`CREATE TABLE \`${Confidential.database}\`.\`main_settings\` ( 
            \`key\` TEXT NULL DEFAULT NULL , 
            \`value\` TEXT NULL DEFAULT NULL ) ENGINE = InnoDB;`,
            'Creating main table . . .'],
        [`INSERT INTO \`main_settings\` (\`key\`, \`value\`) VALUES 
        ('running','true'),
        ('prefix','-'),
        ('devs','175390734608891905'),
        ('admins',''),
        ('mods',''),
        ('maincolor',''),
        ('discordGuilds',''),
        ('mainGuild',''),
        ('robloxGroups',''),
        ('robloxEnabled','false'),
        ('usersblacklisted','');`, 'Inserting Default Settings . . .']
    ],
    logs: (table) => {
        return [
            [`CREATE TABLE \`${Confidential.database}\`.\`${table}\` ( 
            \`id\` INT NOT NULL AUTO_INCREMENT , 
            \`discordId\` BIGINT NOT NULL , 
            \`target\` INT NULL DEFAULT NULL , 
            \`action\` VARCHAR(1000) NOT NULL DEFAULT '' COLLATE 'utf8_unicode_ci' , 
            \`groupId\` INT NULL DEFAULT NULL , 
            \`rank\` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci' , 
            \`reason\` LONGTEXT NULL DEFAULT NULL , 
            \`date\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP , 
            PRIMARY KEY (\`id\`) )
            COLLATE='utf8_unicode_ci'
            ENGINE = InnoDB
            AUTO_INCREMENT=50;`,
                `Creating ${table} table . . .`]
        ];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBb0Q7QUFHcEQsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO0FBRXBDLFFBQUEsTUFBTSxHQUFHO0lBQ2xCLHVCQUF1QjtJQUN2QixNQUFNLEVBQUUsWUFBWSxDQUFDLElBQUk7SUFDekIsVUFBVSxFQUFFLFlBQVksQ0FBQyxRQUFRO0lBQ2pDLFVBQVUsRUFBRSxZQUFZLENBQUMsUUFBUTtJQUNqQyxVQUFVLEVBQUUsWUFBWSxDQUFDLFFBQVE7SUFFakMsWUFBWTtJQUNaLE9BQU8sRUFBRSxZQUFZLENBQUMsS0FBSztJQUUzQixnREFBZ0Q7SUFDaEQsMEJBQTBCLEVBQUU7UUFDeEIsU0FBUztRQUNULFFBQVE7UUFDUixTQUFTO1FBQ1QsV0FBVztLQUNkO0lBRUQsaURBQWlEO0lBQ2pELDJCQUEyQixFQUFFO1FBQ3pCLFNBQVM7UUFDVCxRQUFRO1FBQ1IsV0FBVztRQUNYLGtCQUFrQjtLQUNyQjtDQUNKLENBQUE7QUFFRCxJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDbkIsa0NBQW1CLENBQUE7SUFDbkIsa0NBQW1CLENBQUE7SUFDbkIsc0NBQXVCLENBQUE7QUFDM0IsQ0FBQyxFQUpXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBSXRCO0FBRUQsSUFBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ2pCLDBCQUFhLENBQUE7SUFDYixnQ0FBbUIsQ0FBQTtBQUN2QixDQUFDLEVBSFcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFHcEI7QUFFWSxRQUFBLGdCQUFnQixHQUFHO0lBQzVCLE1BQU07SUFDTixVQUFVO0NBQ2IsQ0FBQztBQUVXLFFBQUEsV0FBVyxHQUF1QjtJQUMzQyxjQUFjLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUFFLE9BQU87WUFDdkMsQ0FBQyxrQkFBa0IsWUFBWSxDQUFDLFFBQVEsUUFBUSxLQUFLOzs7NkJBR2hDO2dCQUNyQiw0QkFBNEIsQ0FBQztZQUU3QixDQUFDLGlCQUFpQixLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQXNCRDtnQkFDbEIsa0NBQWtDLENBQUMsQ0FBQywrQkFBK0I7U0FDMUUsQ0FBQTtJQUFBLENBQUM7SUFDRixhQUFhLEVBQUU7UUFDWCxDQUFDLGtCQUFrQixZQUFZLENBQUMsUUFBUTs7Z0VBRWdCO1lBQ3hELDJCQUEyQixDQUFDO1FBQzVCLENBQUM7Ozs7Ozs7Ozs7O2lDQVd3QixFQUFFLGtDQUFrQyxDQUFDO0tBQ2pFO0lBQ0QsSUFBSSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUU7UUFBRSxPQUFPO1lBQzdCLENBQUMsa0JBQWtCLFlBQVksQ0FBQyxRQUFRLFFBQVEsS0FBSzs7Ozs7Ozs7Ozs7OytCQVk5QjtnQkFDdkIsWUFBWSxLQUFLLGNBQWMsQ0FBQztTQUNuQyxDQUFBO0lBQUEsQ0FBQztDQUNMLENBQUEifQ==