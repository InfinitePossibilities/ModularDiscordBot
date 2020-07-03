"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
class exampleevent {
    constructor() {
        this._event = "exampleevent";
        this._help = "This is an example event";
        this._isTest = false;
        this._Type = config_1.EventType.CORE;
        this.info = {
            event: () => { return this._event; },
            help: () => { return this._help; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runEvent = async (client) => {
            console.log("Ready to Go!");
            // Run code every 5 seconds
            setInterval(async () => {
                // Code here
            }, 5000);
        };
    }
}
module.exports = exampleevent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZWV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V2ZW50cy9leGFtcGxlZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxzQ0FBc0M7QUFFdEMsTUFBTSxZQUFZO0lBQWxCO1FBQ3FCLFdBQU0sR0FBRyxjQUFjLENBQUM7UUFDeEIsVUFBSyxHQUFHLDBCQUEwQixDQUFDO1FBQ25DLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLGtCQUFTLENBQUMsSUFBSSxDQUFDO1FBRXhDLFNBQUksR0FBRztZQUNILEtBQUssRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQzNDLElBQUksRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFjLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQSxDQUFDO1NBQzlDLENBQUE7UUFFRCxhQUFRLEdBQUcsS0FBSyxFQUFFLE1BQXNCLEVBQWlCLEVBQUU7WUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUU1QiwyQkFBMkI7WUFDM0IsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNuQixZQUFZO1lBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNaLENBQUMsQ0FBQTtJQUVMLENBQUM7Q0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIn0=