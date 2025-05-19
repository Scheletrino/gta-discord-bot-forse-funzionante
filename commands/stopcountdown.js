const { SlashCommandBuilder } = require('discord.js');

const CANALE_COUNTDOWN = '1372183339032645672';
const RUOLI_AUTORIZZATI = ['🎴Manager🎴', '⚜️Head-Admin⚜️'];

let countdownInterval; // da sincronizzare con startcountdown.js

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stopcountdown')
    .setDescription('Ferma il countdown verso l\'uscita di GTA 6'),
  async execute(interaction) {
    // Controllo ruolo
    const memberRoles = interaction.member.roles.cache.map(r => r.name);
    if (!memberRoles.some(r => RUOLI_AUTORIZZATI.includes(r))) {
      return interaction.reply({ content: '❌ Non hai i permessi per usare questo comando.', ephemeral: true });
    }

    if (interaction.channel.id !== CANALE_COUNTDOWN) {
      return interaction.reply({ content: `❌ Usa questo comando solo nel canale <#${CANALE_COUNTDOWN}>`, ephemeral: true });
    }

    if (!countdownInterval) {
      return interaction.reply({ content: 'ℹ️ Il countdown non è attivo.', ephemeral: true });
    }

    clearInterval(countdownInterval);
    countdownInterval = null;

    await interaction.reply('🛑 Countdown fermato.');
  }
};
