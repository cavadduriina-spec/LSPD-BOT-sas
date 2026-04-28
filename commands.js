const { SlashCommandBuilder } = require("discord.js");

module.exports = [
  new SlashCommandBuilder()
    .setName("arresto")
    .setDescription("Registra arresto")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true))
    .addStringOption(o => o.setName("data").setDescription("Data nascita").setRequired(true))
    .addStringOption(o => o.setName("reati").setDescription("Reati").setRequired(true))
    .addIntegerOption(o => o.setName("mesi").setDescription("Mesi").setRequired(true))
    .addStringOption(o => o.setName("sequestrati").setDescription("Oggetti sequestrati").setRequired(true))
    .addStringOption(o => o.setName("consegnati").setDescription("Oggetti consegnati").setRequired(true))
    .addAttachmentOption(o => o.setName("foto").setDescription("Foto").setRequired(true))
    .addUserOption(o => o.setName("collega1").setDescription("Collega").setRequired(true))
    .addUserOption(o => o.setName("collega2").setDescription("Collega 2").setRequired(true)),

  new SlashCommandBuilder()
    .setName("edit_arresto")
    .setDescription("Modifica arresto")
    .addStringOption(o => o.setName("id").setDescription("ID arresto").setRequired(true)),

  new SlashCommandBuilder()
    .setName("pda")
    .setDescription("Rilascia PDA")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true))
    .addStringOption(o => o.setName("data").setDescription("Data nascita").setRequired(true))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(true)),

  new SlashCommandBuilder()
    .setName("edit_pda")
    .setDescription("Modifica PDA")
    .addStringOption(o => o.setName("id").setDescription("ID PDA").setRequired(true)),

  new SlashCommandBuilder()
    .setName("ritira_pda")
    .setDescription("Ritira PDA")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true)),

  new SlashCommandBuilder()
    .setName("sequestro")
    .setDescription("Sequestro auto")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true))
    .addStringOption(o => o.setName("data").setDescription("Data nascita").setRequired(true))
    .addStringOption(o => o.setName("targa").setDescription("Targa").setRequired(true))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(true))
    .addAttachmentOption(o => o.setName("foto").setDescription("Foto").setRequired(true))
    .addUserOption(o => o.setName("agente").setDescription("Agente").setRequired(true)),

  new SlashCommandBuilder()
    .setName("dissequestro")
    .setDescription("Dissequestra")
    .addStringOption(o => o.setName("id").setDescription("ID").setRequired(true)),

  new SlashCommandBuilder()
    .setName("multa")
    .setDescription("Registra multa")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true))
    .addStringOption(o => o.setName("data").setDescription("Data nascita").setRequired(true))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(true))
    .addIntegerOption(o => o.setName("importo").setDescription("Importo").setRequired(true)),

  new SlashCommandBuilder()
    .setName("denuncia")
    .setDescription("Registra denuncia")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true))
    .addStringOption(o => o.setName("data").setDescription("Data nascita").setRequired(true))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(true)),

  new SlashCommandBuilder()
    .setName("info_persona")
    .setDescription("Info persona")
    .addStringOption(o => o.setName("nome").setDescription("Nome").setRequired(true)),

  new SlashCommandBuilder()
    .setName("info_agente")
    .setDescription("Statistiche agente")
];