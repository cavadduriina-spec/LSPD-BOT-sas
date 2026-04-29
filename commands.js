const { SlashCommandBuilder } = require("discord.js");

module.exports = [

  // ARRESTO
  new SlashCommandBuilder()
    .setName("arresto")
    .setDescription("Registra arresto")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome"))
    .addStringOption(o => o.setName("data").setRequired(true).setDescription("Data nascita"))
    .addStringOption(o => o.setName("reati").setRequired(true).setDescription("Reati"))
    .addIntegerOption(o => o.setName("mesi").setRequired(true).setDescription("Mesi"))
    .addStringOption(o => o.setName("sequestrati").setRequired(true).setDescription("Oggetti sequestrati"))
    .addStringOption(o => o.setName("consegnati").setRequired(true).setDescription("Oggetti consegnati"))
    .addUserOption(o => o.setName("collega1").setRequired(true).setDescription("Collega 1"))
    .addUserOption(o => o.setName("collega2").setRequired(true).setDescription("Collega 2")),

  new SlashCommandBuilder()
    .setName("edit_arresto")
    .setDescription("Modifica arresto")
    .addStringOption(o => o.setName("id").setRequired(true).setDescription("ID"))
    .addStringOption(o => o.setName("nome").setDescription("Nome"))
    .addStringOption(o => o.setName("data").setDescription("Data"))
    .addStringOption(o => o.setName("reati").setDescription("Reati"))
    .addIntegerOption(o => o.setName("mesi").setDescription("Mesi")),

  // PDA
  new SlashCommandBuilder()
    .setName("pda")
    .setDescription("Rilascia PDA")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome"))
    .addStringOption(o => o.setName("data").setRequired(true).setDescription("Data nascita"))
    .addStringOption(o => o.setName("motivo").setRequired(true).setDescription("Motivo")),

  new SlashCommandBuilder()
    .setName("edit_pda")
    .setDescription("Modifica PDA")
    .addStringOption(o => o.setName("id").setRequired(true).setDescription("ID"))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo")),

  new SlashCommandBuilder()
    .setName("ritira_pda")
    .setDescription("Ritira PDA")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome")),

  // SEQUESTRO
  new SlashCommandBuilder()
    .setName("sequestro")
    .setDescription("Sequestro auto")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome"))
    .addStringOption(o => o.setName("data").setRequired(true).setDescription("Data"))
    .addStringOption(o => o.setName("targa").setRequired(true).setDescription("Targa"))
    .addStringOption(o => o.setName("motivo").setRequired(true).setDescription("Motivo")),

  new SlashCommandBuilder()
    .setName("dissequestro")
    .setDescription("Rimuovi sequestro")
    .addStringOption(o => o.setName("id").setRequired(true).setDescription("ID")),

  // MULTA
  new SlashCommandBuilder()
    .setName("multa")
    .setDescription("Registra multa")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome"))
    .addStringOption(o => o.setName("data").setRequired(true).setDescription("Data"))
    .addStringOption(o => o.setName("motivo").setRequired(true).setDescription("Motivo"))
    .addIntegerOption(o => o.setName("importo").setRequired(true).setDescription("Importo")),

  // DENUNCIA
  new SlashCommandBuilder()
    .setName("denuncia")
    .setDescription("Registra denuncia")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome"))
    .addStringOption(o => o.setName("data").setRequired(true).setDescription("Data"))
    .addStringOption(o => o.setName("motivo").setRequired(true).setDescription("Motivo")),

  // INFO
  new SlashCommandBuilder()
    .setName("info_persona")
    .setDescription("Info persona")
    .addStringOption(o => o.setName("nome").setRequired(true).setDescription("Nome")),

  // CARTELLINO
  new SlashCommandBuilder()
    .setName("cartellino")
    .setDescription("Pannello cartellino"),

  new SlashCommandBuilder()
    .setName("aggiungi_ore")
    .setDescription("Aggiungi ore")
    .addUserOption(o => o.setName("utente").setRequired(true))
    .addIntegerOption(o => o.setName("minuti").setRequired(true))
];