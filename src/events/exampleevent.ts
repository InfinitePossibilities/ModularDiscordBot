import * as Discord from "discord.js";
import { IBotEvent } from "../eventAPI";
import { EventType } from "../config";

class exampleevent implements IBotEvent {
    private readonly _event = "exampleevent";
    private readonly _help = "This is an example event";
    private readonly _isTest = false;
    private readonly _Type = EventType.CORE;

    info = {
        event: (): string => { return this._event },
        help: (): string => { return this._help },
        isTest: (): boolean => { return this._isTest },
        Type: (): EventType => { return this._Type}
    }

    runEvent = async (client: Discord.Client, msgObject: Discord.Message): Promise<void> => {
        console.log("Ready to Go!");

        // Run code every 5 seconds
        setInterval(async () => {
            // Code here
        }, 5000)
    }

}

module.exports = exampleevent;