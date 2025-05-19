
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

client.once('ready', () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
