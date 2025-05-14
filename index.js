
require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const express = require('express');

dayjs.extend(duration);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const GTA6_RELEASE_DATE = dayjs('2026-05-26T00:00:00');
const COUNTDOWN_CHANNEL_ID = '1372183339032645672'; // tuo canale countdown

let countdownMessage = null;

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
  const channel = await client.channels.fetch(COUNTDOWN_CHANNEL_ID);
  if (channel && channel.isTextBased()) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('⏳ Countdown GTA 6')
      .setDescription('Caricamento...')
      .setTimestamp(new Date());
    countdownMessage = await channel.send({ embeds: [embed] });
    updateCountdown(); // primo aggiornamento
    setInterval(updateCountdown, 1000); // ogni secondo
  }
});

function updateCountdown() {
  if (!countdownMessage) return;
  const now = dayjs();
  const diff = GTA6_RELEASE_DATE.diff(now);
  if (diff <= 0) {
    return countdownMessage.edit({ content: '🕹️ GTA 6 è già uscito!' });
  }
  const dur = dayjs.duration(diff);
  const days = dur.days() + dur.months() * 30 + dur.years() * 365;
  const hours = dur.hours().toString().padStart(2, '0');
  const minutes = dur.minutes().toString().padStart(2, '0');
  const seconds = dur.seconds().toString().padStart(2, '0');

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle('⏳ Countdown per GTA 6')
    .setDescription(`▶️ Esce tra **${days} giorni**, **${hours}:${minutes}:${seconds}**`)
    .setTimestamp(new Date());

  countdownMessage.edit({ embeds: [embed] });
}

// Express keep-alive
const app = express();
app.get('/', (req, res) => res.send('Bot GTA è attivo!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web attivo su porta ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
