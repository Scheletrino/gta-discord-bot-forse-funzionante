const { SlashCommandBuilder } = require('discord.js');

const CANALE_COUNTDOWN = '1372183339032645672';
const RUOLI_AUTORIZZATI = ['🎴Manager🎴', '⚜️Head-Admin⚜️'];

let countdownInterval;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days} giorni, ${hours} ore, ${minutes} minuti`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startcountdown')
    .setDescription('Avvia il countdown verso l\'uscita di GTA 6'),
  async execute(interaction) {
    // Controllo ruolo
    const memberRoles = interaction.member.roles.cache.map(r => r.name);
    if (!memberRoles.some(r => RUOLI_AUTORIZZATI.includes(r))) {
      return interaction.reply({ content: '❌ Non hai i permessi per usare questo comando.', ephemeral: true });
    }

    if (interaction.channel.id !== CANALE_COUNTDOWN) {
      return interaction.reply({ content: `❌ Usa questo comando solo nel canale <#${CANALE_COUNTDOWN}>`, ephemeral: true });
    }

    if (countdownInterval) {
      return interaction.reply({ content: '⏳ Countdown già in esecuzione!', ephemeral: true });
    }

    // Data uscita GTA 6
    const gta6Release = new Date('2026-05-26T00:00:00Z');

    // Invia messaggio iniziale
    const msg = await interaction.reply({ content: '⏳ Calcolo tempo mancante a GTA 6...', fetchReply: true });

    // Funzione aggiorna messaggio
    countdownInterval = setInterval(async () => {
      const now = new Date();
      const diff = gta6Release - now;
      if (diff <= 0) {
        await msg.edit('🎉 GTA 6 è uscito! Buon divertimento!');
        clearInterval(countdownInterval);
        countdownInterval = null;
        return;
      }
      const formatted = formatTime(diff);
      await msg.edit(`⏳ Mancano **${formatted}** all'uscita di GTA 6.`);
    }, 60000); // ogni 60 secondi

  }
};
