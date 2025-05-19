
const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboard } = require('../utils/scoreManager');

module.exports = {
  data: new SlashCommandBuilder().setName('classifica').setDescription('Mostra la classifica del quiz'),
  async execute(interaction) {
    const leaderboard = getLeaderboard();
    if (leaderboard.length === 0) {
      return interaction.reply('📉 Nessun punteggio registrato ancora!');
    }

    const lines = leaderboard.map(([user, score], i) => `${i + 1}. **${user}** — ${score} punto/i`);
    return interaction.reply(`🏆 **Classifica GTA Quiz**\n\n${lines.join('\n')}`);
  }
};
