
// ==================== index.js ====================
// Posiziona questo file nella root del progetto

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Keep-alive HTTP server per Render (opzionale)
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Discord attivo');
}).listen(port, () => {
  console.log(`✅ Server HTTP in ascolto sulla porta ${port}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
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
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Errore durante l\'esecuzione del comando.', ephemeral: true });
  }
});

client.once('ready', async () => {
  console.log(`✅ Bot online come ${client.user.tag}`);

  // Imposta il canale per il countdown
  const channel = await client.channels.fetch(CANALE_COUNTDOWN);
  if (!channel?.isTextBased()) return console.warn('Canale countdown non trovato.');

  // Emoji orologio per simulare animazione
  const clockEmojis = ['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
  let frame = 0;

  // Embed iniziale con emoji e titolo grande
  const initialEmbed = new EmbedBuilder()
    .setTitle(`${clockEmojis[frame]} ⏳ Calcolo tempo mancante a GTA 6...`)
    .setColor('#FF0000');

  let countdownMsg = await channel.send({ embeds: [initialEmbed] });

  // Timer che aggiorna l'embed ogni minuto
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
