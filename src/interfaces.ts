import * as Discord from "discord.js";

export {
    exampleTemplate,
    tableQueryTemplate
};

interface exampleTemplate {
    question: string;
    answer: string;
    skippable: boolean;
}

interface tableQueryTemplate {
    guild_settings: (table: string) => string[][]
    main_settings: string[][]
    logs: (table: string) => string[][]
}