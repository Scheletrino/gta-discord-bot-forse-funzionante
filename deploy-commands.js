
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
  new SlashCommandBuilder().setName('countdown').setDescription('Mostra quanto manca all’uscita di GTA 6'),
  new SlashCommandBuilder().setName('veicoli').setDescription('Elenco veicoli confermati'),
  new SlashCommandBuilder().setName('personaggi').setDescription('Elenco personaggi confermati'),
  new SlashCommandBuilder().setName('mappa').setDescription('Informazioni sulla mappa di GTA 6'),
  new SlashCommandBuilder().setName('minigioco').setDescription('Avvia il quiz GTA'),
  new SlashCommandBuilder().setName('classifica').setDescription('Vedi la classifica del quiz'),
  new SlashCommandBuilder().setName('risposta')
    .setDescription('Rispondi alla domanda del quiz')
    .addStringOption(option => 
      option.setName('lettera')
        .setDescription('La tua risposta: A, B, C o D')
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '1247199833220190300'), { body: commands })
  .then(() => console.log('✅ Comandi / registrati nel server Discord'))
  .catch(console.error);
