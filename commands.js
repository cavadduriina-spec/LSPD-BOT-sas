require("dotenv").config();

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { loadDB, saveDB, getAgent, getPerson } = require("./database");

const STAFF_ROLE = process.env.STAFF_ROLE;
const GESTIONE_ROLE = process.env.GESTIONE_ROLE;

function hasRole(member, role) {
    return member.roles.cache.has(role);
}

function key(nome, cognome, nascita) {
    return `${nome}_${cognome}_${nascita}`.toLowerCase();
}

function newId(db, type) {
    db.globalIds[type]++;
    return db.globalIds[type];
}

function addStats(db, users, type) {
    users.forEach(u => {
        const ag = getAgent(db, u.id);
        ag.stats[type]++;
    });
}

module.exports = {

// ================= SLASH =================
handleSlash: async (interaction) => {
const db = loadDB();

// ================= CARTELLINO =================
if (interaction.commandName === "cartellino") {

    const embed = new EmbedBuilder()
    .setTitle("🚔 CARTELLINO LSPD")
    .setColor("Blue")
    .setDescription(`👮‍♂️ SALVE AGENTE

🟢 TIMBRA → entra in servizio  
🔴 STIMBRA → esci e salva ore  
📊 STAT → controlla stats  
🟡 STATO → verifica servizio`);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("timbra").setLabel("TIMBRA").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("stimbra").setLabel("STIMBRA").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("stats").setLabel("STAT").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("servizio").setLabel("STATO").setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({ embeds: [embed], components: [row] });
}

// ================= AGGIUNGI ORE =================
if (interaction.commandName === "aggiungi_ore") {
    if (!hasRole(interaction.member, GESTIONE_ROLE))
        return interaction.reply({ content: "❌ No permessi", ephemeral: true });

    const user = interaction.options.getUser("utente");
    const ore = interaction.options.getNumber("ore");

    const ag = getAgent(db, user.id);
    ag.ore += ore;

    saveDB(db);
    return interaction.reply(`✅ Ore aggiunte a ${user.tag}`);
}

// ================= FORZA STOP =================
if (interaction.commandName === "forza_stop") {
    if (!hasRole(interaction.member, GESTIONE_ROLE))
        return;

    const user = interaction.options.getUser("utente");
    const ag = getAgent(db, user.id);

    ag.inServizio = false;
    ag.entrata = null;

    saveDB(db);
    return interaction.reply("⛔ Servizio terminato forzatamente");
}

// ================= INFO AGENTE =================
if (interaction.commandName === "info_agente") {
    if (!hasRole(interaction.member, GESTIONE_ROLE))
        return;

    const user = interaction.options.getUser("utente");
    const ag = getAgent(db, user.id);

    const embed = new EmbedBuilder()
    .setTitle(`👮 ${user.tag}`)
    .setDescription(`
⏱ Ore: ${ag.ore.toFixed(2)}
🚔 Arresti: ${ag.stats.arresti}
💸 Multe: ${ag.stats.multe}
🚗 Sequestri: ${ag.stats.sequestri}
🔫 PDA: ${ag.stats.pda}
⚖️ Denunce: ${ag.stats.denunce}
`);

    return interaction.reply({ embeds: [embed] });
}

// ================= ARRESTO =================
if (interaction.commandName === "arresto") {

    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");
    const reati = interaction.options.getString("reati");
    const colleghi = interaction.options.getUsers("colleghi") || [];

    const p = getPerson(db, key(nome, cognome, nascita));
    const id = newId(db, "arrest");

    p.fedina.push({ id, reati });
    p.pda = null;

    addStats(db, [interaction.user, ...colleghi], "arresti");

    saveDB(db);

    return interaction.reply({
        embeds: [new EmbedBuilder()
        .setTitle("🚨 ARRESTO")
        .setColor("Red")
        .setDescription(`${nome} ${cognome}`)
        .addFields(
            { name: "ID", value: `${id}` },
            { name: "Reati", value: reati }
        )]
    });
}

// ================= EDIT ARRESTO =================
if (interaction.commandName === "edit_arresto") {
    const id = interaction.options.getInteger("id");
    const nuovo = interaction.options.getString("reati");

    for (let person of Object.values(db.persons)) {
        const arresto = person.fedina.find(a => a.id === id);
        if (arresto) {
            arresto.reati = nuovo;
            saveDB(db);
            return interaction.reply("✅ Arresto modificato");
        }
    }

    return interaction.reply("❌ ID non trovato");
}

// ================= PDA =================
if (interaction.commandName === "rilascia_pda") {
    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");
    const scadenza = interaction.options.getString("scadenza");

    const p = getPerson(db, key(nome, cognome, nascita));
    const id = newId(db, "pda");

    p.pda = { id, scadenza };

    getAgent(db, interaction.user.id).stats.pda++;

    saveDB(db);
    return interaction.reply("🔫 PDA rilasciato");
}

if (interaction.commandName === "ritira_pda") {
    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");

    const p = getPerson(db, key(nome, cognome, nascita));

    p.pda = null;

    saveDB(db);
    return interaction.reply("❌ PDA ritirato");
}

if (interaction.commandName === "edit_pda") {
    const id = interaction.options.getInteger("id");
    const scadenza = interaction.options.getString("scadenza");

    for (let person of Object.values(db.persons)) {
        if (person.pda && person.pda.id === id) {
            person.pda.scadenza = scadenza;
            saveDB(db);
            return interaction.reply("✅ PDA modificato");
        }
    }
}

// ================= DENUNCIA =================
if (interaction.commandName === "denuncia") {
    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");
    const reati = interaction.options.getString("reati");

    const p = getPerson(db, key(nome, cognome, nascita));
    const id = newId(db, "denunce");

    p.denunce.push({ id, reati });

    getAgent(db, interaction.user.id).stats.denunce++;

    saveDB(db);
    return interaction.reply(`⚖️ Denuncia ID: ${id}`);
}

// ================= MULTA =================
if (interaction.commandName === "multa") {
    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");
    const reato = interaction.options.getString("reato");

    const p = getPerson(db, key(nome, cognome, nascita));
    const id = newId(db, "multe");

    p.multe.push({ id, reato });

    getAgent(db, interaction.user.id).stats.multe++;

    saveDB(db);
    return interaction.reply(`💸 Multa ID: ${id}`);
}

// ================= SEQUESTRO =================
if (interaction.commandName === "sequestra") {
    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");
    const targa = interaction.options.getString("targa");

    const p = getPerson(db, key(nome, cognome, nascita));
    const id = newId(db, "sequestri");

    p.sequestri.push({ id, targa });

    getAgent(db, interaction.user.id).stats.sequestri++;

    saveDB(db);
    return interaction.reply(`🚗 Sequestro ID: ${id}`);
}

// ================= PULISCI FEDINA =================
if (interaction.commandName === "pulisci_fedina") {
    if (!hasRole(interaction.member, STAFF_ROLE))
        return interaction.reply({ content: "❌ No permessi", ephemeral: true });

    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");

    const p = getPerson(db, key(nome, cognome, nascita));
    p.fedina = [];

    saveDB(db);
    return interaction.reply("🧹 Fedina pulita");
}

},

// ================= BOTTONI =================
handleButtons: async (interaction) => {
    const db = loadDB();
    const ag = getAgent(db, interaction.user.id);

    if (interaction.customId === "timbra") {
        ag.inServizio = true;
        ag.entrata = Date.now();
        saveDB(db);
        return interaction.reply({ content: "🟢 In servizio", ephemeral: true });
    }

    if (interaction.customId === "stimbra") {
        if (!ag.entrata) return;

        const ore = (Date.now() - ag.entrata) / 3600000;
        ag.ore += ore;
        ag.inServizio = false;
        ag.entrata = null;

        saveDB(db);
        return interaction.reply({ content: `🔴 Ore: ${ag.ore.toFixed(2)}`, ephemeral: true });
    }

    if (interaction.customId === "stats") {
        return interaction.reply({
            content: `📊 Ore: ${ag.ore.toFixed(2)} | Arresti: ${ag.stats.arresti}`,
            ephemeral: true
        });
    }

    if (interaction.customId === "servizio") {
        return interaction.reply({
            content: ag.inServizio ? "🟡 In servizio" : "⚪ Off duty",
            ephemeral: true
        });
    }
}

};