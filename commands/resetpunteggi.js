
const { SlashCommandBuilder } = require('discord.js');
const { resetScores } = require('../utils/scoreManager');

const RUOLI_AUTORIZZATI = ['🎴Manager🎴', '⚜️Head-Admin⚜️'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetpunteggi')
    .setDescription('Azzera tutti i punteggi'),
  async execute(interaction) {
    const memberRoles = interaction.member.roles.cache.map(r => r.name);
    if (!memberRoles.some(r => RUOLI_AUTORIZZATI.includes(r))) {
      return interaction.reply({ content: '❌ Non hai i permessi per usare questo comando.', ephemeral: true });
    }
    resetScores();
    await interaction.reply('✅ Classifica azzerata.');
  }
};

