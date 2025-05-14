
require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const GTA6_RELEASE_DATE = dayjs('2026-05-26T00:00:00');

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'countdown') {
    const now = dayjs();
    const diff = GTA6_RELEASE_DATE.diff(now);

    if (diff <= 0) {
      return interaction.reply('🕹️ GTA 6 è già uscito!');
    }

    const dur = dayjs.duration(diff);
    const days = dur.days() + dur.months() * 30 + dur.years() * 365;
    const hours = dur.hours();
    const minutes = dur.minutes();

    await interaction.reply(`🕒 GTA 6 esce tra ${days} giorni, ${hours} ore e ${minutes} minuti!`);
  }

  if (commandName === 'veicoli') {
    await interaction.reply(`🚗 **Veicoli confermati in GTA 6:**

Auto & SUV: Oceanic, Audi RS5, Pegassi Aventador, Grotti Furia, Bravado Bison, Enus Jubilee
Moto: Carbon RS, Western Sovereign
Speciali: Tour Bus, Speedo, Granger 3600LX
Imbarcazioni: Longfin, Seashark, Airboat
Elicotteri/Aerei: Maverick, Sea Sparrow, Blimp, Dodo`);
  }

  if (commandName === 'personaggi') {
    await interaction.reply(`👥 **Personaggi confermati in GTA 6:**

• Jason – protagonista maschile
• Lucia – protagonista femminile
• Altri NPC: membri di gang, poliziotti, civili, influencer e animali

🎥 I primi due protagonisti giocabili in coppia nella storia della saga.`);
  }

  if (commandName === 'mappa') {
    await interaction.reply('🗺️ GTA 6 sarà ambientato a **Vice City (Leonida State)**. Mappa in aggiornamento!');
  }
});

client.login(process.env.DISCORD_TOKEN);
