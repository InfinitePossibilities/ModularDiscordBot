import * as Discord from "discord.js";
import * as Settings from "./settings";

/**
 * Returns true if a players ID matches that of the developer's IDs.
 * @param table
 * @param user 
 */
let isDev = async (table: string, user: Discord.User) => {
    var _devIDs = String(await Settings.readSetting(table.toLowerCase(), `devs`)).split(`,`);

    if (await _devIDs.indexOf(user.id) > -1) return true;
    else return false;
}

/**
 * Returns true if a user has an admin role.
 * @param table
 * @param user 
 */
let isGlobalAdmin = async (table: string, user: Discord.User) => {
    var _adminIDs = String(await Settings.readSetting(table.toLowerCase(), `admins`)).split(`,`);

    if (await _adminIDs.indexOf(user.id) > -1) return true;
    else return false;
}

/**
 * Returns true if user has a mod role.
 * @param table
 * @param user 
 */
let isGlobalMod = async (table: string, user: Discord.User) => {
    var _modIDs = String(await Settings.readSetting(table.toLowerCase(), `mods`)).split(`,`);

    if (await _modIDs.indexOf(user.id) > -1) return true;
    else return false;
}

/**
 * Returns true if user is Dev/SuperAdmin/Admin/Mod
 * @param table
 * @param user 
 */
let isGlobalEmpowered = async (table: string, user: Discord.User) => {
    if (await isDev(table, user)||await isGlobalAdmin(table, user)||await isGlobalMod(table, user)) return true;
    else return false;
}

export var global = {
    isDev,
    isGlobalAdmin,
    isGlobalMod,
    isGlobalEmpowered
};

/**
 * Returns true if a user has a local owner role.
 * @param table
 * @param user 
 */
let isLocalOwner = async (table: string, user: Discord.User, guild: Discord.Guild) => {
    var _ownerRoles = String(await Settings.readSetting(table.toLowerCase(), `ownerroles`)).split(`,`);

    // check if player's ID is in the list
    var ret = false;

    guild.member(user)?.roles.cache.forEach(r => { if (_ownerRoles.includes(r.id)) ret = true; });
    return ret;
}

/**
 * Returns true if a user has a local admin role.
 * @param table
 * @param user 
 */
let isLocalAdmin = async (table: string, user: Discord.User, guild: Discord.Guild) => {
    var _adminRoles = String(await Settings.readSetting(table.toLowerCase(), `adminroles`)).split(`,`);

    // check if player's ID is in the list
    var ret = false;

    guild.member(user)?.roles.cache.forEach(r => { if (_adminRoles.includes(r.id)) ret = true; });
    return ret;
}

/**
 * Returns true if user has a local mod role.
 * @param table
 * @param user 
 */
let isLocalMod = async (table: string, user: Discord.User, guild: Discord.Guild) => {
    var _modRoles = String(await Settings.readSetting(table.toLowerCase(), `modroles`)).split(`,`);

    var ret = false;

    guild.member(user)?.roles.cache.forEach(r => { if (_modRoles.includes(r.id)) ret = true; });
    return ret;
}

/**
 * Returns true if user is Dev/SuperAdmin/Admin/Mod
 * @param table
 * @param user 
 */
let isLocalEmpowered = async (table: string, user: Discord.User, guild: Discord.Guild) => {
    if (await isDev(table, user)||await isLocalOwner(table,user,guild)||await isLocalAdmin(table, user, guild)||await isLocalMod(table, user, guild)) return true;
    else return false;
}

/**
 * Returns true if a user has a local role.
 * @param discord 
 * @param user 
 * @param role 
 */
let hasLocalRole = (guild: Discord.Guild, user: Discord.User, role: string) => {
    var ret = false;

    guild.member(user)?.roles.cache.forEach(r => { if (r.id === role) ret = true })

    return ret;
}

/**
 * Returns true if user is Opted In.
 * @param table
 * @param user 
 */
let isOptedIn = async (table: string, user: Discord.User) => {
    var _optedUsers = String(await Settings.readSetting(table.toLowerCase(), `opted`)).split(`,`);

    var ret = false;

    // guild.member(user).roles.forEach(r => { if (_optedUsers.includes(r.id)) ret = true; });
    if (_optedUsers.indexOf(user.id) != -1) { ret = true }
    return ret;
}

/**
 * Returns true if user is Opted In.
 * @param table
 * @param user 
 */
let isLocalProtectee = async (table: string, user: Discord.User, guild: Discord.Guild) => {
    var _protecteeRoles = String(await Settings.readSetting(table.toLowerCase(), `protecteeroles`)).split(`,`);

    var ret = false;

    guild.member(user)?.roles.cache.forEach(r => { if (_protecteeRoles.includes(r.id)) ret = true; });
    return ret;
}

/**
 * Returns true if a user is locally Request Blacklisted.
 * @param table
 * @param user 
 * @param guild 
 */
let isLocalRequestBlacklisted = async (table: string, user: Discord.User) => {
    var _requestBlacklistUsers = String(await Settings.readSetting(table.toLowerCase(), `requestBlacklisted`)).split(`,`);

    if (await _requestBlacklistUsers.indexOf(user.id) > -1) return true;
    else return false;
}

/**
 * Returns true if a user ID is blacklisted.
 * @param table
 * @param user 
 */
let isLocalBlacklisted = async (table: string, user: Discord.User) => {
    // Check if player's ID is revoked in the list
    var ret = false;

    if (String(await Settings.readSetting(table, "usersblacklisted")).includes(user.id)) { ret = true; };
    return ret;
}

/**
 * Returns true if a user has a blacklisted role.
 * @param table
 * @param user 
 */
let isAnnounceBlacklisted = async (table: string, user: Discord.User, guild: Discord.Guild) => {
    var _blacklistedAnnounceRoles = String(await Settings.readSetting(table.toLowerCase(), `roleannounceblacklist`)).split(`,`);

    // Check if player's ID is revoked in the list
    var ret = false;

    guild.member(user)?.roles.cache.forEach(r => { if (_blacklistedAnnounceRoles.includes(r.id)) ret = true; });
    return ret;
}

export var local = {
    isLocalOwner,
    isLocalAdmin,
    isLocalMod,
    isLocalEmpowered,
    hasLocalRole,
    isOptedIn,
    isLocalProtectee,
    isLocalRequestBlacklisted,
    isLocalBlacklisted,
    isAnnounceBlacklisted
};

/**
 * Returns true if a user has revoked permissions.
 * @param table
 * @param user 
 */
let isPermissionRevoked = async (table: string, user: Discord.User) => {
    var _revokedUsers = String(await Settings.readSetting(table.toLowerCase(), `usersblacklisted`)).split(`,`);

    // Check if player's ID is revoked in the list
    if (_revokedUsers.indexOf(user.id) > -1) return true; 
    else return false;
}

export var misc = {
    isPermissionRevoked
}