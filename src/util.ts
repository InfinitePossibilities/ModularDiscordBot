import * as Discord from "discord.js";
import * as Settings from "./settings";
import * as confidential from "../confidential";
var Confidential = confidential.Confidential;

// Event APIs
import { IBotCommand } from "./commandAPI";
import { IBotEvent } from "./eventAPI";
//

var mysql = require('mysql');

// Config
import * as ConfigFile from "./config";
var config = ConfigFile.config;
//

export {
    replaceAll,
    Wait,
    parseJSON,
    setMainEmbedColor,
    setEmbedColor,
    tableExists,
    settingExists,
    checkIfSet,
    userPresence,
    getDBConnection,

    createTable
};

/**
 * Replace and return all string within a string
 * @param str Original string to change
 * @param search String to search for
 * @param replace String to replace search with
 * @returns Replaced string
 */
function replaceAll(str: string, search: string, replace: string) {
    return str.replace(new RegExp(search, 'g'), replace);
}

/**
 * Wait for x amount of time
 * @param time Time in seconds to wait.
 * @returns setTimeout Promise
 */
function Wait(time: number) {
    var convertMilliToSecond = time*1000;
    return new Promise(r => setTimeout(r, convertMilliToSecond))
}

/**
 * Parse JSON and return value
 * @param json JSON to parse
 * @param key Key value to return
 * @returns any
 */
function parseJSON(json: string, key: string) {
    return JSON.parse(json)[key];
}

/**
 * Set color of Embed based on RGB inpui
 * @param embed Embed to target.
 * @param color Color converted to R,G,B
 * @returns void
 */
async function setEmbedColor(embed: Discord.MessageEmbed, color: string) {
    if (String(color).includes(`,`)) {
        var c = replaceAll(String(color).replace('[','').replace(']',''), ' ', '').split(`,`);
        embed.setColor([parseInt(c[0]),parseInt(c[1]),parseInt(c[2])]);
    }else if (String(color).includes(`#`)) {
        embed.setColor(String(color));
    }
}

/**
 * Set color of Embed based on config
 * @param table Table in database to use
 * @param embed Embed to focus
 * @returns void
 */
async function setMainEmbedColor(table: string, embed: Discord.MessageEmbed) {
    if (!(String(await Settings.readSetting(table, `maincolor`)).includes(`null`))) {
        if (String(await Settings.readSetting(table, `maincolor`)).includes(`,`)) {
            var c = replaceAll(String(await Settings.readSetting(table, 'maincolor')).replace('[','').replace(']',''), ' ', '').split(`,`);
            embed.setColor([parseInt(c[0]),parseInt(c[1]),parseInt(c[2])]);
        }else if (String(await Settings.readSetting(table, `maincolor`)).includes(`#`)) {
            embed.setColor(String(await Settings.readSetting(table, `maincolor`)));
        }
    }
}

/**
 * Returns a boolean based on whether or not a table exists.
 * @param table Table in database to use
 * @returns Promise<boolean>
 */
async function tableExists(table: string) {

    // Define query
    var query = `SHOW TABLES`;

    // Run select query on Database
    var resolvedPromise = new Promise((resolve) => {
        getDBConnection().then((database: any) => {
            database.query(query, (err: any, result: any) => {
                // If error, return error and cancel
                if (err) { console.log(`Table does not exist for guild: ${table}`);};
                // Stringify and Parse result into array
                var string = JSON.stringify(result);
                // console.log(string)
                // Get value of array
                resolve(string.includes(`${table}`));
            });
            database.end();
        });
    });

    return resolvedPromise;
}

/**
 * Returns a boolean based on whether or not a table exists.
 * @param table Table in database to use
 * @param setting Setting to check for
 * @returns Promise<boolean>
 */
async function settingExists(table: string, setting: string) {

    // Define query
    var query = `SELECT \`key\` FROM \`${table.toLowerCase()}\``;

    // Run select query on Database
    var resolvedPromise= new Promise(async (resolve) => {
        getDBConnection().then((database: any) => {
            database.query(query, (err: any, result: any) => {
                // If error, return error and cancel
                if (err) { console.log(`Table does not contain setting: ${setting}`);};
                // Stringify and Parse result into array
                var string = JSON.stringify(result);
                // Get value of array
                resolve(string.includes(`${setting.toLowerCase()}`));
            });
            database.end();
        });
    });

    return resolvedPromise;
}

/**
 * Checks a specific setting and returns true if not equal to null
 * @param table Table in database to use.
 * @param setting Setting to check for.
 * @returns boolean
 */
async function checkIfSet(table: string, setting: string) {
    
    if (String(await Settings.readSetting(table, setting)).includes('null')) {
        return false;
    }else {
        return true;
    }
}

/**
 * Sends an HTTPRequest and returns response text.
 * @returns JSON
 */
function userPresence() {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    var theUrl = "http://api.roblox.com/users/7715715/onlinestatus";
    xmlhttp.open("GET", theUrl);
    xmlhttp.send();

    xmlhttp.onreadystatechange = async () => {
        if (await xmlhttp.readyState == 4 && await xmlhttp.status == 200) {
            return(xmlhttp.responseText);
        }
    };

    // return resolvedPromise;

    // var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    // var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    // var theUrl = "https://presence.roblox.com/v1/presence/users";
    // xmlhttp.open("POST", theUrl);
    // xmlhttp.setRequestHeader("Content-Type", "text/json");
    // xmlhttp.setRequestHeader("Accept", "text/json");
    // xmlhttp.send(JSON.stringify({"userIds": [ 7715715 ]}));

    // xmlhttp.onreadystatechange = async () => {
    //     // if (await xmlhttp.readyState == 4 && await xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText);
    //     // }
    // };
}

/**
 * Get and return connection from database connection pool
 * @returns mysql.database
 */
async function getDBConnection() {
    var database = mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database,
    });
    
    database.connect( function (error: any) {
        if (error) throw error;
    });

    return new Promise((resolve) => {
        resolve(database);
    });
}

/**
 * Takes a table name value and creates a table based on queries
 * @param table Table in database to use
 * @param queries Queries array
 * @param msgObject Discord Message
 * @param embed Embed passed
 * @param message Message to edit based on status
 * @returns void
 */
async function createTable(table: any, queryArray: any, msgObject: Discord.Message, embed: Discord.MessageEmbed, message: Promise<string>) {
    if (!await tableExists(table)) {
        // Define log table
        let Querys: String[] = queryArray;
        let _embed = embed;
        let msg = message;

        Querys.forEach((query, i) => {
            setTimeout(async () => {
                // Status string defined in queries array
                var queryStatus = Querys[i][1];
                _embed.setTitle(queryStatus);
                msgObject.channel.messages.cache.get(await msg)?.edit(_embed);
                getDBConnection().then((connection: any) => {
                    // Query defined in queries array
                    var query = Querys[i][0];
                    connection.query(query, (err: any) => {
                        // If error, log error and return false, else return true.
                        if (err) { console.log(err) };
                    });
                    connection.end();
                });
            }, i * 750);
        });
    }
}

export { 
    handleSetup,
    handleElevatedCommand,
    loadElevatedCommands,
    handleCommand,
    loadCommands,
    handleEvent,
    loadEvents,
    loadAllCommands
}

/**
 * Handle Setup Command regardless of Database presence.
 * @param msg Message object.
 * @returns void
 */
async function handleSetup(msg: Discord.Message, bot: Discord.Client, elevated_commands: IBotCommand[]) {
    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].substring(2).toLowerCase();
    let args = msg.content.split(" ").slice(1);

    //Loop through all of our loaded commands
    for (const commandClass of elevated_commands) {

        //Attempt to execute code but keep running incase of error
        try {
            
            // Check if command class is correct command
            if (!(commandClass.info.command() === command)) continue;

            await commandClass.runCommand(args, msg, bot, elevated_commands).catch((e) => { console.log(e) });

        }
        catch (exception) {
            //If there is an error, log error exception for debug
            console.log(exception);
        }
    }
}

/**
 * Handle Elevated Command.
 * @param msg Message object.
 * @returns void
 */
async function handleElevatedCommand(bot: Discord.Client, elevated_commands: IBotCommand[], msg: Discord.Message) {
    //Split the string into the command and all of the args
    let prefix = String(await Settings.readSetting('main_settings', `prefix`));
    let command = msg.content.split(" ")[0].replace(prefix+prefix, "").toLowerCase();
    let args = msg.content.split(" ").slice(1);

    if (await Settings.readSetting('main_settings', 'running') == 'true' || command == 'toggle') {
        //Loop through all of our loaded commands
        for (const commandClass of elevated_commands) {

            //Attempt to execute code but keep running incase of error
            try {
                
                // Check if command class is correct command
                if (!(commandClass.info.command() === command)) continue;

                await commandClass.runCommand(args, msg, bot, elevated_commands).catch((e) => { console.log(e); msg.channel.send("There was an error running that command! Please notify your local developer!"); });

            }
            catch (exception) {
                //If there is an error, log error exception for debug
                console.log(exception);
            }
        }
    }
}

/**
 * Load Elevated Commands into Memory from path.
 * @param commandsPath Path to folder containing elevated commands.
 * @returns void
 */
function loadElevatedCommands(commandsPath: string, elevated_commands: IBotCommand[]) {
    //Loop through all of the commands in the config file
    const fs = require('fs');
    const commandsFolder = commandsPath;

    // Get a list of all commands inside commandsFolder
    fs.readdir(commandsFolder, (err: any, files: any) => {
        // For each file in commandsFolder, add to commands variable
        files.forEach((fileName: any) => {
            // console.log(file);
            const commandsClass = require(`${commandsPath}/${replaceAll(fileName, ".js", "")}`)

            const command = new commandsClass() as IBotCommand;

            elevated_commands.push(command);
        });
    })

    // for (const commandName of config.commands as String[])
}

/**
 * Handle nonElevated Command.
 * @param msg Message object
 * @returns void
 */
async function handleCommand(bot: Discord.Client, commands: IBotCommand[], msg: Discord.Message) {
    //Split the string into the command and all of the args
    let prefix = await Settings.readSetting(`${msg.guild?.id}_settings`, `prefix`);
    //Regexpression
    const prefixRegex = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);
    const matchedPrefix = msg.content.match(prefixRegex) || [];

    //Setup variables
    let args = prefixRegex.test(msg.content) 
        ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ").slice(1)
        : msg.content.split(" ").slice(1);
    let command = prefixRegex.test(msg.content) 
        ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ")[0].toLowerCase()
        : await msg.content.split(" ")[0].replace(String(await prefix), "").toLowerCase();

    let localRunning = String(await Settings.readSetting(`${msg.guild?.id.toString()}_settings`, 'running'));
    let globalRunning = String(await Settings.readSetting('main_settings', 'running'));

    if ((globalRunning == 'true' && localRunning == 'true') || command == 'toggle') {
        //Loop through all of our loaded commands
        for (const commandClass of commands) {

            //Attempt to execute code but keep running incase of error
            try {
                
                // Check if command class is correct command
                if (!(commandClass.info.command() === command)) continue;

                await commandClass.runCommand(args, msg, bot, commands).catch((e) => { console.log(e); msg.channel.send("There was an error running that command! Please notify your local developer!"); });

            }
            catch (exception) {
                //If there is an error, log error exception for debug
                console.log(exception);
            }
        }
    }
}

/**
 * Load nonElevated Commands into Memory from path.
 * @param commandsPath Path to folder containing commands.
 * @returns void
 */
function loadCommands(commandsPath: string, commands: IBotCommand[]) {
    //Loop through all of the commands in the config file
    const fs = require('fs');
    const commandsFolder = commandsPath;

    // Get a list of all commands inside commandsFolder
    fs.readdir(commandsFolder, (err: any, files: any) => {
        // For each file in commandsFolder, add to commands variable
        files.forEach((fileName: any) => {
            // console.log(file);
            const commandsClass = require(`${commandsPath}/${replaceAll(fileName, ".js", "")}`)

            const command = new commandsClass() as IBotCommand;

            commands.push(command);
        });
    })

    // for (const commandName of config.commands as String[])
}

/**
 * Run Events passed by the application.
 * @param event Name of event to run.
 * @param extra Extra variables to pass into event scope.
 * @returns void
 */
async function handleEvent(bot: Discord.Client, event: string, events: IBotEvent[], extra?: any) {
    // Loop through all events
    for (const eventClass of events) {
        try {
            // Check if event class is correct event
            if (!(eventClass.info.event() === event)) continue;

            await eventClass.runEvent(bot, extra).catch((e) => { console.log(e) });
        }
        catch(exception) {
            // If there is an error, log exception
            console.log(exception);
        }
    }
}

/**
 * Load Events into Memory
 * @param eventsPath Path to folder containing events.
 * @returns void
 */
function loadEvents(eventsPath: string, events: IBotEvent[]) {
    const fs = require('fs');
    const eventsFolder = './events';

    // Get a list of all events inside eventsFolder
    fs.readdir(eventsFolder, (err: any, files: any) => {
        // For each file in eventsFolder, add to events variable
        files.forEach((eventName: any) => {
            const eventsClass = require(`${eventsPath}/${replaceAll(eventName, ".js", "")}`)

            const event = new eventsClass() as IBotEvent;

            events.push(event);
        });
    })
}

/**
 * Load ALL Commands into Memory
 * @returns void
 */
function loadAllCommands(commands: IBotCommand[], elevated_commands: IBotCommand[], directory: string) {
    Object.keys(ConfigFile.CommandType).forEach((commandType) => {
        loadCommands(`${directory}/commands/${commandType.toString().toLowerCase()}`, commands);
        loadElevatedCommands(`${directory}/elevatedcommands/${commandType.toString().toLowerCase()}`, elevated_commands);
    });
}