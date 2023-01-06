import {WebhookClient} from "discord.js";

const DISCORD_ID = process.env.DISCORD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

console.log(`DISCORD_ID=${DISCORD_ID}`);

export const discordClient = new WebhookClient({
    id: DISCORD_ID,
    token: DISCORD_TOKEN,
});
