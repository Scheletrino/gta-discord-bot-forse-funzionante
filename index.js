
// index.js
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Costanti
const CANALE_COUNTDOWN = '1372183339032645672';
const GTA6_RELEASE = new Date('2026-05-26T00:00:00Z');

// Funzione di formattazione
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days    = Math.floor(totalSeconds / (3600*24));
  const hours   = Math.floor((totalSeconds % (3600*24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days} giorni, ${hours} ore, ${minutes} minuti`;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carica comandi...
// (la parte che già avevi per fs.readdirSync e client.on('interactionCreate'))

client.once('ready', async () => {
  console.log(`✅ Bot online come ${client.user.tag}`);

  // 1) Recupera il canale
  const channel = await client.channels.fetch(CANALE_COUNTDOWN);
  if (!channel || !channel.isTextBased()) return console.warn('Canale countdown non trovato.');

  // 2) Invia o recupera il messaggio pinnato (opzionale)
  // Per semplicità qui ne creiamo uno nuovo ad ogni avvio:
  let countdownMsg = await channel.send('⏳ Calcolo tempo mancante a GTA 6...');
  // Se vuoi riusare sempre lo stesso, puoi cercare tra i messaggi pinnati e usare quello.

  // 3) Avvia il timer
  setInterval(async () => {
    const diff = GTA6_RELEASE - new Date();
    if (diff <= 0) {
      await countdownMsg.edit('🎉 GTA 6 è uscito!');
      return; // non serve più aggiornare
    }
    await countdownMsg.edit(`⏳ Mancano **${formatTime(diff)}** all'uscita di GTA 6.`);
  }, 60_000); // ogni 60s
});

client.login(process.env.DISCORD_TOKEN);
