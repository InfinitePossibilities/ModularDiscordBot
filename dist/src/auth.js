"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.misc = exports.local = exports.global = void 0;
const Settings = require("./settings");
/**
 * Returns true if a players ID matches that of the developer's IDs.
 * @param table
 * @param user
 */
let isDev = async (table, user) => {
    var _devIDs = String(await Settings.readSetting(table.toLowerCase(), `devs`)).split(`,`);
    if (await _devIDs.indexOf(user.id) > -1)
        return true;
    else
        return false;
};
/**
 * Returns true if a user has an admin role.
 * @param table
 * @param user
 */
let isGlobalAdmin = async (table, user) => {
    var _adminIDs = String(await Settings.readSetting(table.toLowerCase(), `admins`)).split(`,`);
    if (await _adminIDs.indexOf(user.id) > -1)
        return true;
    else
        return false;
};
/**
 * Returns true if user has a mod role.
 * @param table
 * @param user
 */
let isGlobalMod = async (table, user) => {
    var _modIDs = String(await Settings.readSetting(table.toLowerCase(), `mods`)).split(`,`);
    if (await _modIDs.indexOf(user.id) > -1)
        return true;
    else
        return false;
};
/**
 * Returns true if user is Dev/SuperAdmin/Admin/Mod
 * @param table
 * @param user
 */
let isGlobalEmpowered = async (table, user) => {
    if (await isDev(table, user) || await isGlobalAdmin(table, user) || await isGlobalMod(table, user))
        return true;
    else
        return false;
};
exports.global = {
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
let isLocalOwner = async (table, user, guild) => {
    var _a;
    var _ownerRoles = String(await Settings.readSetting(table.toLowerCase(), `ownerroles`)).split(`,`);
    // check if player's ID is in the list
    var ret = false;
    (_a = guild.member(user)) === null || _a === void 0 ? void 0 : _a.roles.cache.forEach(r => { if (_ownerRoles.includes(r.id))
        ret = true; });
    return ret;
};
/**
 * Returns true if a user has a local admin role.
 * @param table
 * @param user
 */
let isLocalAdmin = async (table, user, guild) => {
    var _a;
    var _adminRoles = String(await Settings.readSetting(table.toLowerCase(), `adminroles`)).split(`,`);
    // check if player's ID is in the list
    var ret = false;
    (_a = guild.member(user)) === null || _a === void 0 ? void 0 : _a.roles.cache.forEach(r => { if (_adminRoles.includes(r.id))
        ret = true; });
    return ret;
};
/**
 * Returns true if user has a local mod role.
 * @param table
 * @param user
 */
let isLocalMod = async (table, user, guild) => {
    var _a;
    var _modRoles = String(await Settings.readSetting(table.toLowerCase(), `modroles`)).split(`,`);
    var ret = false;
    (_a = guild.member(user)) === null || _a === void 0 ? void 0 : _a.roles.cache.forEach(r => { if (_modRoles.includes(r.id))
        ret = true; });
    return ret;
};
/**
 * Returns true if user is Dev/SuperAdmin/Admin/Mod
 * @param table
 * @param user
 */
let isLocalEmpowered = async (table, user, guild) => {
    if (await isDev(table, user) || await isLocalOwner(table, user, guild) || await isLocalAdmin(table, user, guild) || await isLocalMod(table, user, guild))
        return true;
    else
        return false;
};
/**
 * Returns true if a user has a local role.
 * @param discord
 * @param user
 * @param role
 */
let hasLocalRole = (guild, user, role) => {
    var _a;
    var ret = false;
    (_a = guild.member(user)) === null || _a === void 0 ? void 0 : _a.roles.cache.forEach(r => { if (r.id === role)
        ret = true; });
    return ret;
};
/**
 * Returns true if user is Opted In.
 * @param table
 * @param user
 */
let isOptedIn = async (table, user) => {
    var _optedUsers = String(await Settings.readSetting(table.toLowerCase(), `opted`)).split(`,`);
    var ret = false;
    // guild.member(user).roles.forEach(r => { if (_optedUsers.includes(r.id)) ret = true; });
    if (_optedUsers.indexOf(user.id) != -1) {
        ret = true;
    }
    return ret;
};
/**
 * Returns true if user is Opted In.
 * @param table
 * @param user
 */
let isLocalProtectee = async (table, user, guild) => {
    var _a;
    var _protecteeRoles = String(await Settings.readSetting(table.toLowerCase(), `protecteeroles`)).split(`,`);
    var ret = false;
    (_a = guild.member(user)) === null || _a === void 0 ? void 0 : _a.roles.cache.forEach(r => { if (_protecteeRoles.includes(r.id))
        ret = true; });
    return ret;
};
/**
 * Returns true if a user is locally Request Blacklisted.
 * @param table
 * @param user
 * @param guild
 */
let isLocalRequestBlacklisted = async (table, user) => {
    var _requestBlacklistUsers = String(await Settings.readSetting(table.toLowerCase(), `requestBlacklisted`)).split(`,`);
    if (await _requestBlacklistUsers.indexOf(user.id) > -1)
        return true;
    else
        return false;
};
/**
 * Returns true if a user ID is blacklisted.
 * @param table
 * @param user
 */
let isLocalBlacklisted = async (table, user) => {
    // Check if player's ID is revoked in the list
    var ret = false;
    if (String(await Settings.readSetting(table, "usersblacklisted")).includes(user.id)) {
        ret = true;
    }
    ;
    return ret;
};
/**
 * Returns true if a user has a blacklisted role.
 * @param table
 * @param user
 */
let isAnnounceBlacklisted = async (table, user, guild) => {
    var _a;
    var _blacklistedAnnounceRoles = String(await Settings.readSetting(table.toLowerCase(), `roleannounceblacklist`)).split(`,`);
    // Check if player's ID is revoked in the list
    var ret = false;
    (_a = guild.member(user)) === null || _a === void 0 ? void 0 : _a.roles.cache.forEach(r => { if (_blacklistedAnnounceRoles.includes(r.id))
        ret = true; });
    return ret;
};
exports.local = {
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
let isPermissionRevoked = async (table, user) => {
    var _revokedUsers = String(await Settings.readSetting(table.toLowerCase(), `usersblacklisted`)).split(`,`);
    // Check if player's ID is revoked in the list
    if (_revokedUsers.indexOf(user.id) > -1)
        return true;
    else
        return false;
};
exports.misc = {
    isPermissionRevoked
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUF1QztBQUV2Qzs7OztHQUlHO0FBQ0gsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDcEQsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFekYsSUFBSSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDOztRQUNoRCxPQUFPLEtBQUssQ0FBQztBQUN0QixDQUFDLENBQUE7QUFFRDs7OztHQUlHO0FBQ0gsSUFBSSxhQUFhLEdBQUcsS0FBSyxFQUFFLEtBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDNUQsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFN0YsSUFBSSxNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDOztRQUNsRCxPQUFPLEtBQUssQ0FBQztBQUN0QixDQUFDLENBQUE7QUFFRDs7OztHQUlHO0FBQ0gsSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLEtBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDMUQsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMs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