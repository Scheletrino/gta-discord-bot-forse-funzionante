
const { SlashCommandBuilder } = require('discord.js');
const { removePoints } = require('../utils/scoreManager');

const RUOLI_AUTORIZZATI = ['🎴Manager🎴', '⚜️Head-Admin⚜️'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rimuovipunti')
    .setDescription('Rimuovi punti a un giocatore')
    .addStringOption(opt => opt.setName('nome').setDescription('Nome del giocatore').setRequired(true))
    .addIntegerOption(opt => opt.setName('punti').setDescription('Numero di punti da rimuovere').setRequired(true)),
  async execute(interaction) {
    const memberRoles = interaction.member.roles.cache.map(r => r.name);
    if (!memberRoles.some(r => RUOLI_AUTORIZZATI.includes(r))) {
      return interaction.reply({ content: '❌ Non hai i permessi per usare questo comando.', ephemeral: true });
    }
    const nome = interaction.options.getString('nome');
    const punti = interaction.options.getInteger('punti');
    removePoints(nome, punti);
    await interaction.reply(`✅ Rimossi ${punti} punti a **${nome}**.`);
  }
};
