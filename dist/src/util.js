"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllCommands = exports.loadEvents = exports.handleEvent = exports.loadCommands = exports.handleCommand = exports.loadElevatedCommands = exports.handleElevatedCommand = exports.handleSetup = exports.createTable = exports.getDBConnection = exports.userPresence = exports.checkIfSet = exports.settingExists = exports.tableExists = exports.setEmbedColor = exports.setMainEmbedColor = exports.parseJSON = exports.Wait = exports.replaceAll = void 0;
const Settings = require("./settings");
const confidential = require("../confidential");
var Confidential = confidential.Confidential;
//
var mysql = require('mysql');
// Config
const ConfigFile = require("./config");
var config = ConfigFile.config;
/**
 * Replace and return all string within a string
 * @param str Original string to change
 * @param search String to search for
 * @param replace String to replace search with
 * @returns Replaced string
 */
function replaceAll(str, search, replace) {
    return str.replace(new RegExp(search, 'g'), replace);
}
exports.replaceAll = replaceAll;
/**
 * Wait for x amount of time
 * @param time Time in seconds to wait.
 * @returns setTimeout Promise
 */
function Wait(time) {
    var convertMilliToSecond = time * 1000;
    return new Promise(r => setTimeout(r, convertMilliToSecond));
}
exports.Wait = Wait;
/**
 * Parse JSON and return value
 * @param json JSON to parse
 * @param key Key value to return
 * @returns any
 */
function parseJSON(json, key) {
    return JSON.parse(json)[key];
}
exports.parseJSON = parseJSON;
/**
 * Set color of Embed based on RGB inpui
 * @param embed Embed to target.
 * @param color Color converted to R,G,B
 * @returns void
 */
async function setEmbedColor(embed, color) {
    if (String(color).includes(`,`)) {
        var c = replaceAll(String(color).replace('[', '').replace(']', ''), ' ', '').split(`,`);
        embed.setColor([parseInt(c[0]), parseInt(c[1]), parseInt(c[2])]);
    }
    else if (String(color).includes(`#`)) {
        embed.setColor(String(color));
    }
}
exports.setEmbedColor = setEmbedColor;
/**
 * Set color of Embed based on config
 * @param table Table in database to use
 * @param embed Embed to focus
 * @returns void
 */
async function setMainEmbedColor(table, embed) {
    if (!(String(await Settings.readSetting(table, `maincolor`)).includes(`null`))) {
        if (String(await Settings.readSetting(table, `maincolor`)).includes(`,`)) {
            var c = replaceAll(String(await Settings.readSetting(table, 'maincolor')).replace('[', '').replace(']', ''), ' ', '').split(`,`);
            embed.setColor([parseInt(c[0]), parseInt(c[1]), parseInt(c[2])]);
        }
        else if (String(await Settings.readSetting(table, `maincolor`)).includes(`#`)) {
            embed.setColor(String(await Settings.readSetting(table, `maincolor`)));
        }
    }
}
exports.setMainEmbedColor = setMainEmbedColor;
/**
 * Returns a boolean based on whether or not a table exists.
 * @param table Table in database to use
 * @returns Promise<boolean>
 */
async function tableExists(table) {
    // Define query
    var query = `SHOW TABLES`;
    // Run select query on Database
    var resolvedPromise = new Promise((resolve) => {
        getDBConnection().then((database) => {
            database.query(query, (err, result) => {
                // If error, return error and cancel
                if (err) {
                    console.log(`Table does not exist for guild: ${table}`);
                }
                ;
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
exports.tableExists = tableExists;
/**
 * Returns a boolean based on whether or not a table exists.
 * @param table Table in database to use
 * @param setting Setting to check for
 * @returns Promise<boolean>
 */
async function settingExists(table, setting) {
    // Define query
    var query = `SELECT \`key\` FROM \`${table.toLowerCase()}\``;
    // Run select query on Database
    var resolvedPromise = new Promise(async (resolve) => {
        getDBConnection().then((database) => {
            database.query(query, (err, result) => {
                // If error, return error and cancel
                if (err) {
                    console.log(`Table does not contain setting: ${setting}`);
                }
                ;
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
exports.settingExists = settingExists;
/**
 * Checks a specific setting and returns true if not equal to null
 * @param table Table in database to use.
 * @param setting Setting to check for.
 * @returns boolean
 */
async function checkIfSet(table, setting) {
    if (String(await Settings.readSetting(table, setting)).includes('null')) {
        return false;
    }
    else {
        return true;
    }
}
exports.checkIfSet = checkIfSet;
/**
 * Sends an HTTPRequest and returns response text.
 * @returns JSON
 */
function userPresence() {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
    var theUrl = "http://api.roblox.com/users/7715715/onlinestatus";
    xmlhttp.open("GET", theUrl);
    xmlhttp.send();
    xmlhttp.onreadystatechange = async () => {
        if (await xmlhttp.readyState == 4 && await xmlhttp.status == 200) {
            return (xmlhttp.responseText);
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
exports.userPresence = userPresence;
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
    database.connect(function (error) {
        if (error)
            throw error;
    });
    return new Promise((resolve) => {
        resolve(database);
    });
}
exports.getDBConnection = getDBConnection;
/**
 * Takes a table name value and creates a table based on queries
 * @param table Table in database to use
 * @param queries Queries array
 * @param msgObject Discord Message
 * @param embed Embed passed
 * @param message Message to edit based on status
 * @returns void
 */
async function createTable(table, queryArray, msgObject, embed, message) {
    if (!await tableExists(table)) {
        // Define log table
        let Querys = queryArray;
        let _embed = embed;
        let msg = message;
        Querys.forEach((query, i) => {
            setTimeout(async () => {
                var _a;
                // Status string defined in queries array
                var queryStatus = Querys[i][1];
                _embed.setTitle(queryStatus);
                (_a = msgObject.channel.messages.cache.get(await msg)) === null || _a === void 0 ? void 0 : _a.edit(_embed);
                getDBConnection().then((connection) => {
                    // Query defined in queries array
                    var query = Querys[i][0];
                    connection.query(query, (err) => {
                        // If error, log error and return false, else return true.
                        if (err) {
                            console.log(err);
                        }
                        ;
                    });
                    connection.end();
                });
            }, i * 750);
        });
    }
}
exports.createTable = createTable;
/**
 * Handle Setup Command regardless of Database presence.
 * @param msg Message object.
 * @returns void
 */
async function handleSetup(msg, bot, elevated_commands) {
    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].substring(2).toLowerCase();
    let args = msg.content.split(" ").slice(1);
    //Loop through all of our loaded commands
    for (const commandClass of elevated_commands) {
        //Attempt to execute code but keep running incase of error
        try {
            // Check if command class is correct command
            if (!(commandClass.info.command() === command))
                continue;
            await commandClass.runCommand(args, msg, bot, elevated_commands).catch((e) => { console.log(e); });
        }
        catch (exception) {
            //If there is an error, log error exception for debug
            console.log(exception);
        }
    }
}
exports.handleSetup = handleSetup;
/**
 * Handle Elevated Command.
 * @param msg Message object.
 * @returns void
 */
async function handleElevatedCommand(bot, elevated_commands, msg) {
    //Split the string into the command and all of the args
    let prefix = String(await Settings.readSetting('main_settings', `prefix`));
    let command = msg.content.split(" ")[0].replace(prefix + prefix, "").toLowerCase();
    let args = msg.content.split(" ").slice(1);
    if (await Settings.readSetting('main_settings', 'running') == 'true' || command == 'toggle') {
        //Loop through all of our loaded commands
        for (const commandClass of elevated_commands) {
            //Attempt to execute code but keep running incase of error
            try {
                // Check if command class is correct command
                if (!(commandClass.info.command() === command))
                    continue;
                await commandClass.runCommand(args, msg, bot, elevated_commands).catch((e) => { console.log(e); msg.channel.send("There was an error running that command! Please notify your local developer!"); });
            }
            catch (exception) {
                //If there is an error, log error exception for debug
                console.log(exception);
            }
        }
    }
}
exports.handleElevatedCommand = handleElevatedCommand;
/**
 * Load Elevated Commands into Memory from path.
 * @param commandsPath Path to folder containing elevated commands.
 * @returns void
 */
function loadElevatedCommands(commandsPath, elevated_commands) {
    //Loop through all of the commands in the config file
    const fs = require('fs');
    const commandsFolder = commandsPath;
    // Get a list of all commands inside commandsFolder
    fs.readdir(commandsFolder, (err, files) => {
        // For each file in commandsFolder, add to commands variable
        files.forEach((fileName) => {
            // console.log(file);
            const commandsClass = require(`${commandsPath}/${replaceAll(fileName, ".js", "")}`);
            const command = new commandsClass();
            elevated_commands.push(command);
        });
    });
    // for (const commandName of config.commands as String[])
}
exports.loadElevatedCommands = loadElevatedCommands;
/**
 * Handle nonElevated Command.
 * @param msg Message object
 * @returns void
 */
async function handleCommand(bot, commands, msg) {
    var _a, _b, _c;
    //Split the string into the command and all of the args
    let prefix = await Settings.readSetting(`${(_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id}_settings`, `prefix`);
    //Regexpression
    const prefixRegex = new RegExp(`^(<@!?${(_b = bot.user) === null || _b === void 0 ? void 0 : _b.id}>)\\s*`);
    const matchedPrefix = msg.content.match(prefixRegex) || [];
    //Setup variables
    let args = prefixRegex.test(msg.content)
        ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ").slice(1)
        : msg.content.split(" ").slice(1);
    let command = prefixRegex.test(msg.content)
        ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ")[0].toLowerCase()
        : await msg.content.split(" ")[0].replace(String(await prefix), "").toLowerCase();
    let localRunning = String(await Settings.readSetting(`${(_c = msg.guild) === null || _c === void 0 ? void 0 : _c.id.toString()}_settings`, 'running'));
    let globalRunning = String(await Settings.readSetting('main_settings', 'running'));
    if ((globalRunning == 'true' && localRunning == 'true') || command == 'toggle') {
        //Loop through all of our loaded commands
        for (const commandClass of commands) {
            //Attempt to execute code but keep running incase of error
            try {
                // Check if command class is correct command
                if (!(commandClass.info.command() === command))
                    continue;
                await commandClass.runCommand(args, msg, bot, commands).catch((e) => { console.log(e); msg.channel.send("There was an error running that command! Please notify your local developer!"); });
            }
            catch (exception) {
                //If there is an error, log error exception for debug
                console.log(exception);
            }
        }
    }
}
exports.handleCommand = handleCommand;
/**
 * Load nonElevated Commands into Memory from path.
 * @param commandsPath Path to folder containing commands.
 * @returns void
 */
function loadCommands(commandsPath, commands) {
    //Loop through all of the commands in the config file
    const fs = require('fs');
    const commandsFolder = commandsPath;
    // Get a list of all commands inside commandsFolder
    fs.readdir(commandsFolder, (err, files) => {
        // For each file in commandsFolder, add to commands variable
        files.forEach((fileName) => {
            // console.log(file);
            const commandsClass = require(`${commandsPath}/${replaceAll(fileName, ".js", "")}`);
            const command = new commandsClass();
            commands.push(command);
        });
    });
    // for (const commandName of config.commands as String[])
}
exports.loadCommands = loadCommands;
/**
 * Run Events passed by the application.
 * @param event Name of event to run.
 * @param extra Extra variables to pass into event scope.
 * @returns void
 */
async function handleEvent(bot, event, events, extra) {
    // Loop through all events
    for (const eventClass of events) {
        try {
            // Check if event class is correct event
            if (!(eventClass.info.event() === event))
                continue;
            await eventClass.runEvent(bot, extra).catch((e) => { console.log(e); });
        }
        catch (exception) {
            // If there is an error, log exception
            console.log(exception);
        }
    }
}
exports.handleEvent = handleEvent;
/**
 * Load Events into Memory
 * @param eventsPath Path to folder containing events.
 * @returns void
 */
function loadEvents(eventsPath, events) {
    const fs = require('fs');
    const eventsFolder = './events';
    // Get a list of all events inside eventsFolder
    fs.readdir(eventsFolder, (err, files) => {
        // For each file in eventsFolder, add to events variable
        files.forEach((eventName) => {
            const eventsClass = require(`${eventsPath}/${replaceAll(eventName, ".js", "")}`);
            const event = new eventsClass();
            events.push(event);
        });
    });
}
exports.loadEvents = loadEvents;
/**
 * Load ALL Commands into Memory
 * @returns void
 */
function loadAllCommands(commands, elevated_commands, directory) {
    Object.keys(ConfigFile.CommandType).forEach((commandType) => {
        loadCommands(`${directory}/commands/${commandType.toString().toLowerCase()}`, commands);
        loadElevatedCommands(`${directory}/elevatedcommands/${commandType.toString().toLowerCase()}`, elevated_commands);
    });
}
exports.loadAllCommands = loadAllCommands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUF1QztBQUN2QyxnREFBZ0Q7QUFDaEQsSUFBSSxZQUFZLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztBQUs3QyxFQUFFO0FBRUYsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRTdCLFNBQVM7QUFDVCx1Q0FBdUM7QUFDdkMsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQWtCL0I7Ozs7OztHQU1HO0FBQ0gsU0FBUyxVQUFVLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxPQUFlO0lBQzVELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQXZCRyxnQ0FBVTtBQXlCZDs7OztHQUlHO0FBQ0gsU0FBUyxJQUFJLENBQUMsSUFBWTtJQUN0QixJQUFJLG9CQUFvQixHQUFHLElBQUksR0FBQyxJQUFJLENBQUM7SUFDckMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO0FBQ2hFLENBQUM7QUFoQ0csb0JBQUk7QUFrQ1I7Ozs7O0dBS0c7QUFDSCxTQUFTLFNBQVMsQ0FBQyxJQUFZLEVBQUUsR0FBVztJQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQXpDRyw4QkFBUztBQTJDYjs7Ozs7R0FLRztBQUNILEtBQUssVUFBVSxhQUFhLENBQUMsS0FBMkIsRUFBRSxLQUFhO0lBQ25FLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMs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