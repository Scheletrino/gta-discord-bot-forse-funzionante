const { SlashCommandBuilder } = require('discord.js');

const CANALE_COUNTDOWN = '1372183339032645672';
const RUOLI_AUTORIZZATI = ['🎴Manager🎴', '⚜️Head-Admin⚜️'];

let countdownInterval;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stopcountdown')
    .setDescription('Ferma il countdown'),
  async execute(interaction) {
    const memberRoles = interaction.member.roles.cache.map(r => r.name);
    if (!memberRoles.some(r => RUOLI_AUTORIZZATI.includes(r))) {
      return interaction.reply({ content: '❌ No permessi.', ephemeral: true });
    }
    if (interaction.channel.id !== CANALE_COUNTDOWN) {
      return interaction.reply({ content: `❌ Usa solo in <#${CANALE_COUNTDOWN}>`, ephemeral: true });
    }
    if (!countdownInterval) {
      return interaction.reply({ content: 'ℹ️ Nessun countdown attivo.', ephemeral: true });
    }
    clearInterval(countdownInterval);
    countdownInterval = null;
    await interaction.reply('🛑 Countdown fermato.');
  }
};

