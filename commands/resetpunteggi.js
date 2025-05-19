
const { SlashCommandBuilder } = require('discord.js');
const { resetScores } = require('../utils/scoreManager');

module.exports = {
  data: new SlashCommandBuilder().setName('resetpunteggi').setDescription('Resetta tutta la classifica'),
  async execute(interaction) {
    const allowed = ["🎴Manager🎴", "⚜️Head-Admin⚜️"];
    if (!interaction.member.roles.cache.some(r => allowed.includes(r.name))) {
      return interaction.reply({ content: '❌ Non hai il permesso per usare questo comando.', ephemeral: true });
    }
    resetScores();
    interaction.reply('✅ Classifica azzerata.');
  }
};
