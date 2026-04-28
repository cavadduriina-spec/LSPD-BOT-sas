require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { loadDB, saveDB, getID } = require("./database");
const commands = require("./commands");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands.map(c => c.toJSON()) }
  );
  console.log("Comandi registrati");
})();

client.once(Events.ClientReady, () => {
  console.log("BOT ONLINE");
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const db = loadDB();

  if (interaction.commandName === "arresto") {
    const id = getID();

    const nome = interaction.options.getString("nome");
    const data = interaction.options.getString("data");

    db.arresti[id] = {
      nome,
      data,
      reati: interaction.options.getString("reati"),
      mesi: interaction.options.getInteger("mesi")
    };

    if (!db.persone[nome]) {
      db.persone[nome] = { arresti: 0, denunce: 0, multe: 0 };
    }

    db.persone[nome].arresti++;

    saveDB(db);

    interaction.reply(`Arresto registrato ID: ${id}`);
  }

  if (interaction.commandName === "pda") {
    const id = getID();
    const nome = interaction.options.getString("nome");

    db.pda[id] = {
      nome,
      motivo: interaction.options.getString("motivo"),
      attivo: true
    };

    saveDB(db);

    interaction.reply(`PDA rilasciato ID: ${id}`);
  }

  if (interaction.commandName === "ritira_pda") {
    const nome = interaction.options.getString("nome");

    Object.values(db.pda).forEach(p => {
      if (p.nome === nome) p.attivo = false;
    });

    saveDB(db);

    interaction.reply("PDA ritirato");
  }

  if (interaction.commandName === "info_persona") {
    const nome = interaction.options.getString("nome");

    if (!db.persone[nome]) {
      db.persone[nome] = { arresti: 0, denunce: 0, multe: 0 };
    }

    const p = db.persone[nome];

    interaction.reply(
      `Nome: ${nome}
Arresti: ${p.arresti}
Denunce: ${p.denunce}
Multe: ${p.multe}`
    );
  }

  saveDB(db);
});

client.login(process.env.TOKEN);