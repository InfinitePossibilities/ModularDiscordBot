"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSetting = exports.removeSetting = exports.addSetting = exports.writeSetting = exports.readSetting = void 0;
const util_1 = require("./util");
/**
 * Reads a value from a table in the database
 * @param table Table to edit
 * @param setting Setting string to read from in table
 * @returns Promise<any>
 */
function readSetting(table, setting) {
    // Define query
    var query = `SELECT \`${table.toLowerCase()}\`.\`value\` FROM \`${table.toLowerCase()}\` WHERE \`${table.toLowerCase()}\`.\`key\` = ?`;
    // Run select query on Database
    let resolvedPromise = new Promise((resolve) => {
        util_1.getDBConnection().then((connection) => {
            connection.query(query, [setting], (err, result) => {
                // If error, return error and cancel
                if (err) {
                    console.log(err);
                }
                ;
                if (result.length == 0) {
                    resolve("");
                    return;
                }
                else {
                    // Stringify and Parse result into array
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    // Get value of array
                    resolve(json[0].value);
                }
            });
            connection.end();
        });
    });
    return resolvedPromise;
}
exports.readSetting = readSetting;
/**
 * Writes a setting value to a table in the database.
 * @param table Table to edit
 * @param setting Setting to write to
 * @param value Value to write
 * @returns void
 */
function writeSetting(table, setting, value) {
    // Define query
    var query = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;
    // Run update query on Database
    util_1.getDBConnection().then((connection) => {
        connection.query(query, [value, setting.toLowerCase()], (err) => {
            // If error, log error and return false, else return true.
            if (err) {
                console.log(err);
            }
            ;
        });
        connection.end();
    });
}
exports.writeSetting = writeSetting;
/**
 * Writes a setting as a list out to a table in the database.
 * @param table Table to edit
 * @param setting Setting to add to
 * @param value Value to add
 * @returns void
 */
function addSetting(table, setting, value) {
    // Define Query
    var querySelect = `SELECT \`${table.toLowerCase()}\`.\`value\` FROM \`${table.toLowerCase()}\` WHERE \`${table.toLowerCase()}\`.\`key\` = ?`;
    // Define promise for select query on Database
    var queryDatabase = new Promise((resolve) => {
        util_1.getDBConnection().then((connection) => {
            connection.query(querySelect, [setting], (err, result) => {
                // If error, return false
                if (err) {
                    console.log(err);
                    return false;
                }
                if (result.length == 0) {
                    resolve("");
                    return;
                }
                else {
                    // Stringify and Parse result into array
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    // Get value of array
                    resolve(json[0].value);
                }
                ;
            });
            connection.end();
        });
    });
    // Run query and "then" get a value
    queryDatabase.then((val) => {
        var currentDatabaseValue = val.split(",");
        // Define and add new value to previously defined value
        currentDatabaseValue.push(value);
        if (currentDatabaseValue[0] == '') {
            // Define Query
            var queryUpdate = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;
            // Run update query on Database
            util_1.getDBConnection().then((connection) => {
                connection.query(queryUpdate, [currentDatabaseValue.slice(1).join(), setting], (err) => {
                    // If error, log error and return false, else return true.
                    if (err) {
                        console.log(err);
                    }
                    ;
                });
                connection.end();
            });
        }
        else {
            // Define Query
            var queryUpdate = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;
            // Run update query on Database
            util_1.getDBConnection().then((connection) => {
                connection.query(queryUpdate, [currentDatabaseValue.join(), setting], (err) => {
                    // If error, log error and return false, else return true.
                    if (err) {
                        console.log(err);
                    }
                    ;
                });
                connection.end();
            });
        }
    });
}
exports.addSetting = addSetting;
/**
 * Removes a value from a setting, writing out as a list to table in the database.
 * @param table Table to edit
 * @param setting Setting to remove
 * @param value Value to remove
 * @returns void
 */
function removeSetting(table, setting, value) {
    // Define Query
    var querySelect = `SELECT \`${table.toLowerCase()}\`.\`value\` FROM \`${table.toLowerCase()}\` WHERE \`${table.toLowerCase()}\`.\`key\` = ?`;
    // Define promise for select query on Database
    var queryDatabase = new Promise((resolve) => {
        util_1.getDBConnection().then((connection) => {
            connection.query(querySelect, [setting], (err, result) => {
                // If error, return false
                if (err) {
                    console.log(err);
                }
                if (result.length == 0) {
                    resolve("");
                    return;
                }
                else {
                    // Stringify and Parse result into array
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    // Get value of array
                    resolve(json[0].value);
                }
                ;
            });
            connection.end();
        });
    });
    // Run query and "then" get a value
    queryDatabase.then((val) => {
        var currentDatabaseValue = val.split(",");
        // Redefine and remove value from previously defined value
        currentDatabaseValue = currentDatabaseValue.filter((filter) => { return filter != value; });
        // Define Query
        var queryUpdate = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;
        // Run update query on Database
        util_1.getDBConnection().then(async (connection) => {
            await connection.query(queryUpdate, [currentDatabaseValue.join(), setting], (err) => {
                // If error, log error and return false, else return true.
                if (err) {
                    console.log(err);
                }
                ;
            });
            connection.end();
        });
    });
}
exports.removeSetting = removeSetting;
/**
 * Clears a setting from a table in the database and replaces it with "null".
 * @param table Table to change
 * @param setting Setting to clear
 * @returns void
 */
function clearSetting(table, setting) {
    // Define query
    var query = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = '' WHERE \`key\` = ?`;
    // Run update query on Database
    var resolvedPromise = new Promise((resolve) => {
        util_1.getDBConnection().then((connection) => {
            connection.query(query, [setting.toLowerCase()], (err) => {
                // If error, log error and return false, else return true.
                if (err) {
                    console.log(err);
                }
                ;
                //
                resolve();
            });
            connection.end();
        });
    });
    return resolvedPromise;
}
exports.clearSetting = clearSetting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlDO0FBVXpDOzs7OztHQUtHO0FBQ0gsU0FBUyxXQUFXLENBQUMsS0FBYSxFQUFFLE9BQWU7SUFFL0MsZUFBZTtJQUNmLElBQUksS0FBSyxHQUFHLFlBQVksS0FBSyxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsS0FBSyxDQUFDLFdBQVcsRUFBRSxjQUFjLEtBQUssQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7SUFFdkksK0JBQStCO0lBQy9CLElBQUksZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDMUMsc0JBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQWUsRUFBRSxFQUFFO1lBQ3ZDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxHQUFRLEVBQUUsTUFBVyxFQUFFLEVBQUU7Z0JBQ3hELG9DQUFvQztnQkFDcEMsSUFBSSxHQUFHLEVBQUU7b0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFBRTtnQkFBQSxDQUFDO2dCQUMvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO29CQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFBQyxPQUFPO2lCQUFFO3FCQUFLO29CQUNqRCx3Q0FBd0M7b0JBQ3hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzlCLHFCQUFxQjtvQkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDMUI7WUFD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