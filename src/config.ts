import * as ConfidentialFile from "../confidential";
import { tableQueryTemplate } from "./interfaces";

var Confidential = ConfidentialFile.Confidential;

export const config = {
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
}

export enum CommandType {
    GENERAL = "GENERAL",
    UTILITY = "UTILITY",
    DEVELOPER = "DEVELOPER"
}

export enum EventType {
    CORE = "CORE",
    GENERAL = "GENERAL"
}

export const commandOverrides = [
    "keep",
    "override"
];

export const tableQuerys: tableQueryTemplate = {
    guild_settings: (table: string) => {return [
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
    ]},
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
    logs: (table: string) => {return [
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
    ]}
}