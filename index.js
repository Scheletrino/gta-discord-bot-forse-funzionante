
require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online come ${client.user.tag}`);

  const commands = client.commands.map(cmd => cmd.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, '1247199833220190300'),
      { body: commands }
    );
    console.log("✅ Comandi slash registrati");
  } catch (err) {
    console.error("❌ Errore registrazione comandi:", err);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: "❌ Errore durante l'esecuzione del comando.", ephemeral: true });
    }
  }
});

const app = express();
app.get('/', (_, res) => res.send('Bot GTA attivo'));
app.listen(process.env.PORT || 3000);

client.login(process.env.DISCORD_TOKEN);
