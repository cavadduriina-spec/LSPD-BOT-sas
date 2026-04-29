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

// 🔍 funzione universale per trovare per ID
function findById(db, type, id) {
    for (let person of Object.values(db.persons)) {
        if (person[type]) {
            const found = person[type].find(x => x.id === id);
            if (found) return { person, found };
        }
    }
    return null;
}

module.exports = {

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

// ================= ARRESTO =================
if (interaction.commandName === "arresto") {

    const nome = interaction.options.getString("nome");
    const cognome = interaction.options.getString("cognome");
    const nascita = interaction.options.getString("nascita");
    const reati = interaction.options.getString("reati");

    const collega = interaction.options.getUser("colleghi");
    const colleghi = collega ? [collega] : [];

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
    const reati = interaction.options.getString("reati");

    const res = findById(db, "fedina", id);
    if (!res) return interaction.reply("❌ ID non trovato");

    if (reati) res.found.reati = reati;

    saveDB(db);
    return interaction.reply("✅ Arresto modificato");
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
    return interaction.reply(`🔫 PDA rilasciato ID: ${id}`);
}

// ================= EDIT PDA =================
if (interaction.commandName === "edit_pda") {

    const id = interaction.options.getInteger("id");
    const scadenza = interaction.options.getString("scadenza");

    for (let person of Object.values(db.persons)) {
        if (person.pda && person.pda.id === id) {
            if (scadenza) person.pda.scadenza = scadenza;

            saveDB(db);
            return interaction.reply("✅ PDA modificato");
        }
    }

    return interaction.reply("❌ ID non trovato");
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

// ================= EDIT DENUNCIA =================
if (interaction.commandName === "edit_denuncia") {

    const id = interaction.options.getInteger("id");
    const reati = interaction.options.getString("reati");

    const res = findById(db, "denunce", id);
    if (!res) return interaction.reply("❌ ID non trovato");

    if (reati) res.found.reati = reati;

    saveDB(db);
    return interaction.reply("✅ Denuncia modificata");
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

// ================= EDIT MULTA =================
if (interaction.commandName === "edit_multa") {

    const id = interaction.options.getInteger("id");
    const reato = interaction.options.getString("reato");

    const res = findById(db, "multe", id);
    if (!res) return interaction.reply("❌ ID non trovato");

    if (reato) res.found.reato = reato;

    saveDB(db);
    return interaction.reply("✅ Multa modificata");
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

// ================= EDIT SEQUESTRO =================
if (interaction.commandName === "edit_sequestro") {

    const id = interaction.options.getInteger("id");
    const targa = interaction.options.getString("targa");

    const res = findById(db, "sequestri", id);
    if (!res) return interaction.reply("❌ ID non trovato");

    if (targa) res.found.targa = targa;

    saveDB(db);
    return interaction.reply("✅ Sequestro modificato");
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