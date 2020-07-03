import { getDBConnection } from "./util";

export { 
    readSetting,
    writeSetting,
    addSetting,
    removeSetting,
    clearSetting
};

/**
 * Reads a value from a table in the database
 * @param table Table to edit
 * @param setting Setting string to read from in table
 * @returns Promise<any>
 */
function readSetting(table: string, setting: string) {

    // Define query
    var query = `SELECT \`${table.toLowerCase()}\`.\`value\` FROM \`${table.toLowerCase()}\` WHERE \`${table.toLowerCase()}\`.\`key\` = ?`;

    // Run select query on Database
    let resolvedPromise = new Promise((resolve) => {
        getDBConnection().then((connection: any) => {
            connection.query(query, [setting],(err: any, result: any) => {
                // If error, return error and cancel
                if (err) { console.log(err); };
                if (result.length == 0) { resolve(""); return; }else {
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

/**
 * Writes a setting value to a table in the database.
 * @param table Table to edit
 * @param setting Setting to write to
 * @param value Value to write
 * @returns void
 */
function writeSetting(table: string, setting: string, value: any) {
    
    // Define query
    var query = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;

    // Run update query on Database
    getDBConnection().then((connection: any) => {
        connection.query(query, [value, setting.toLowerCase()],(err: any) => {
            // If error, log error and return false, else return true.
            if (err) { console.log(err) };
        });
        connection.end();
    });
}

/**
 * Writes a setting as a list out to a table in the database.
 * @param table Table to edit
 * @param setting Setting to add to
 * @param value Value to add
 * @returns void
 */
function addSetting(table: string, setting: string, value: string) {

    // Define Query
    var querySelect = `SELECT \`${table.toLowerCase()}\`.\`value\` FROM \`${table.toLowerCase()}\` WHERE \`${table.toLowerCase()}\`.\`key\` = ?`;

    // Define promise for select query on Database
    var queryDatabase = new Promise((resolve) => {
        getDBConnection().then((connection: any) => {
            connection.query(querySelect, [setting], (err: any, result: any) => {
                // If error, return false
                if (err) { console.log(err); return false; }
                if (result.length == 0) { resolve(""); return; }else {
                    // Stringify and Parse result into array
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    // Get value of array
                    resolve(json[0].value);
                };
            });
            connection.end();
        });
    });

    // Run query and "then" get a value
    queryDatabase.then((val) => { 
        var currentDatabaseValue = (val as String).split(",");

        // Define and add new value to previously defined value
        currentDatabaseValue.push(value);

        if (currentDatabaseValue[0] == '') {
            // Define Query
            var queryUpdate = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;

            // Run update query on Database
            getDBConnection().then((connection: any) => {
                connection.query(queryUpdate, [currentDatabaseValue.slice(1).join(), setting], (err: any) => {
                    // If error, log error and return false, else return true.
                    if (err) { console.log(err) };
                });
                connection.end();
            });
        }else {
            // Define Query
            var queryUpdate = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;

            // Run update query on Database
            getDBConnection().then((connection: any) => {
                connection.query(queryUpdate, [currentDatabaseValue.join(), setting], (err: any) => {
                    // If error, log error and return false, else return true.
                    if (err) { console.log(err) };
                });
                connection.end();
            });
        }
    });
}

/**
 * Removes a value from a setting, writing out as a list to table in the database.
 * @param table Table to edit
 * @param setting Setting to remove
 * @param value Value to remove
 * @returns void
 */
function removeSetting(table: string, setting: string, value: string) {
    // Define Query
    var querySelect = `SELECT \`${table.toLowerCase()}\`.\`value\` FROM \`${table.toLowerCase()}\` WHERE \`${table.toLowerCase()}\`.\`key\` = ?`;

    // Define promise for select query on Database
    var queryDatabase = new Promise((resolve) => {
        getDBConnection().then((connection: any) => {
            connection.query(querySelect, [setting], (err: any, result: any) => {
                // If error, return false
                if (err) { console.log(err) }
                if (result.length == 0) { resolve(""); return; }else {
                    // Stringify and Parse result into array
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    // Get value of array
                    resolve(json[0].value);
                };
            });
            connection.end();
        });
    });

    // Run query and "then" get a value
    queryDatabase.then((val) => { 
        var currentDatabaseValue = (val as String).split(",");

        // Redefine and remove value from previously defined value
        currentDatabaseValue = currentDatabaseValue.filter((filter) => { return filter != value; } );

        // Define Query
        var queryUpdate = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = ? WHERE \`key\` = ?`;

        // Run update query on Database
        getDBConnection().then(async (connection: any) => {
            await connection.query(queryUpdate, [currentDatabaseValue.join(), setting], (err: any) => {
                // If error, log error and return false, else return true.
                if (err) { console.log(err) };
            });
            connection.end();
        });
    });
}

/**
 * Clears a setting from a table in the database and replaces it with "null".
 * @param table Table to change
 * @param setting Setting to clear
 * @returns void
 */
function clearSetting(table: string, setting: string) {
    // Define query
    var query = `UPDATE \`${table.toLowerCase()}\` SET \`value\` = '' WHERE \`key\` = ?`;

    // Run update query on Database
    var resolvedPromise = new Promise((resolve) => {
        getDBConnection().then((connection: any) => {
            connection.query(query, [setting.toLowerCase()], (err: any) => {
                // If error, log error and return false, else return true.
                if (err) { console.log(err) };
                //
                resolve();
            });
            connection.end();
        });
    });

    return resolvedPromise;
}