
// ==================== index.js ====================
// Posiziona questo file nella root del progetto

const fs = require('fs');
const path = require('path');
const http = require('http');
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// Keep-alive HTTP server per Render (opzionale)
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Discord attivo');
}).listen(port, () => {
  console.log(`✅ Server HTTP in ascolto sulla porta ${port}`);
});

// Costanti countdown
const CANALE_COUNTDOWN = '1372183339032645672';
const GTA6_RELEASE = new Date('2026-05-26T00:00:00Z');

// Funzione di formattazione del tempo
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days    = Math.floor(totalSeconds / (3600*24));
  const hours   = Math.floor((totalSeconds % (3600*24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days} giorni, ${hours} ore, ${minutes} minuti`;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

// Carica comandi dalla cartella commands/
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  });

// Gestione interazioni
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Errore durante l\'esecuzione del comando.', ephemeral: true });
  }
});

// ==================== READY & COUNTDOWN AUTOMATICO ====================
client.once('ready', async () => {
  console.log(`✅ Bot online come ${client.user.tag}`);

  // Recupera il canale di countdown
  const channel = await client.channels.fetch(CANALE_COUNTDOWN);
  if (!channel?.isTextBased()) return console.warn('Canale countdown non trovato.');

  // Emoji orologio per simulare animazione
  const clockEmojis = ['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
  let frame = 0;

  // Embed iniziale con emoji e titolo grande
  const initialEmbed = new EmbedBuilder()
    .setTitle(`${clockEmojis[frame]} ⏳ Mancano ${formatTime(GTA6_RELEASE - new Date())} all'uscita di GTA 6`)
    .setColor('#FF0000');

  // Invia il messaggio di countdown
  const countdownMsg = await channel.send({ embeds: [initialEmbed] });

  // Aggiorna l'embed ogni minuto
  setInterval(async () => {
    frame++;
    const diff = GTA6_RELEASE - new Date();
    const title = diff <= 0
      ? '🎉 GTA 6 è uscito!'
      : `${clockEmojis[frame % clockEmojis.length]} ⏳ Mancano **${formatTime(diff)}** all'uscita di GTA 6`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(diff <= 0 ? '#00FF00' : '#FF0000');

    await countdownMsg.edit({ embeds: [embed] });
  }, 60_000);
});

// Avvia il bot
client.login(process.env.DISCORD_TOKEN);

// Assicurati di avere una cartella 'commands/' nella root contenente i file dei comandi.
