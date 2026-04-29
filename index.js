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

const STAFF_ROLE_1 = process.env.STAFF_ROLE_1;
const STAFF_ROLE_2 = process.env.STAFF_ROLE_2;

function isStaff(member) {
  return member.roles.cache.has(STAFF_ROLE_1) || member.roles.cache.has(STAFF_ROLE_2);
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands.map(c => c.toJSON()) }
  );
})();

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const db = loadDB();

  // ARRESTO
  if (interaction.commandName === "arresto") {
    const id = getID();
    const nome = interaction.options.getString("nome");

    db.arresti[id] = {
      nome,
      data: interaction.options.getString("data"),
      reati: interaction.options.getString("reati"),
      mesi: interaction.options.getInteger("mesi")
    };

    if (!db.persone[nome]) {
      db.persone[nome] = { arresti: 0, denunce: 0, multe: 0 };
    }

    db.persone[nome].arresti++;

    saveDB(db);
    return interaction.reply(`✅ Arresto ID: ${id}`);
  }

  // EDIT ARRESTO
  if (interaction.commandName === "edit_arresto") {
    if (!isStaff(interaction.member)) return interaction.reply("❌ No permesso");

    const id = interaction.options.getString("id");
    if (!db.arresti[id]) return interaction.reply("❌ Non trovato");

    const a = db.arresti[id];

    a.nome = interaction.options.getString("nome") || a.nome;
    a.data = interaction.options.getString("data") || a.data;
    a.reati = interaction.options.getString("reati") || a.reati;
    a.mesi = interaction.options.getInteger("mesi") || a.mesi;

    saveDB(db);
    return interaction.reply("✅ Modificato");
  }

  // CARTELLINO
  if (interaction.commandName === "cartellino") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("start").setLabel("Timbra Inizio").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("stop").setLabel("Timbra Fine").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("info").setLabel("Info").setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({
      content: "📋 Usa i bottoni per il servizio",
      components: [row]
    });
  }

  saveDB(db);
});

// BOTTONI CARTELLINO
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const db = loadDB();
  const id = interaction.user.id;

  if (!db.agenti[id]) db.agenti[id] = { tempo: 0, start: null };

  if (interaction.customId === "start") {
    db.agenti[id].start = Date.now();
    saveDB(db);
    return interaction.reply({ content: "✅ In servizio", ephemeral: true });
  }

  if (interaction.customId === "stop") {
    if (!db.agenti[id].start) return interaction.reply({ content: "❌ Non attivo", ephemeral: true });

    db.agenti[id].tempo += Date.now() - db.agenti[id].start;
    db.agenti[id].start = null;

    saveDB(db);
    return interaction.reply({ content: "🛑 Fine servizio", ephemeral: true });
  }

  if (interaction.customId === "info") {
    return interaction.reply({
      content: `⏱ Minuti: ${Math.floor(db.agenti[id].tempo / 60000)}`,
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);