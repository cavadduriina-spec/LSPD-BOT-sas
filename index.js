require("dotenv").config();

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const commands = require("./commands");

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel]
});

client.once("ready", () => {
    console.log(`✅ Online: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        commands.handleSlash(interaction);
    }
    if (interaction.isButton()) {
        commands.handleButtons(interaction);
    }
});

client.login(process.env.TOKEN);