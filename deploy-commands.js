
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
  new SlashCommandBuilder().setName('countdown').setDescription('Mostra quanto manca all’uscita di GTA 6'),
  new SlashCommandBuilder().setName('veicoli').setDescription('Elenco veicoli confermati'),
  new SlashCommandBuilder().setName('personaggi').setDescription('Elenco personaggi confermati'),
  new SlashCommandBuilder().setName('mappa').setDescription('Informazioni sulla mappa di GTA 6')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, '1247199833220190300'),
  { body: commands }
)
  .then(() => console.log('✅ Comandi / registrati nel server con ID 1247199833220190300'))
  .catch(console.error);
