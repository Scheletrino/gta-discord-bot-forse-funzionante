const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboard } = require('../utils/scoreManager');

const CANALE_AUTORIZZATO = '1372183510500114543';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('classifica')
    .setDescription('Mostra la classifica del quiz'),
  async execute(interaction) {
    if (interaction.channel.id !== CANALE_AUTORIZZATO) {
      return interaction.reply({ content: '❌ Questo comando può essere usato solo nel canale designato.', ephemeral: true });
    }
    const leaderboard = getLeaderboard();
    if (leaderboard.length === 0) {
      return interaction.reply('📉 Nessun punteggio registrato ancora!');
    }
    const lines = leaderboard.map(([user, score], i) => `${i + 1}. **${user}** — ${score} punto/i`);
    await interaction.reply(`🏆 **Classifica GTA Quiz**\n\n${lines.join('\n')}`);
  }
};
