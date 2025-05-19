
const { SlashCommandBuilder } = require('discord.js');
const { addPoints } = require('../utils/scoreManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aggiungipunti')
    .setDescription('Aggiunge punti a un giocatore')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome giocatore').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('punti').setDescription('Punti da aggiungere').setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString('nome');
    const points = interaction.options.getInteger('punti');
    const allowed = ["🎴Manager🎴", "⚜️Head-Admin⚜️"];
    if (!interaction.member.roles.cache.some(r => allowed.includes(r.name))) {
      return interaction.reply({ content: '❌ Non hai il permesso per usare questo comando.', ephemeral: true });
    }
    addPoints(name, points);
    interaction.reply(`✅ Aggiunti ${points} punti a **${name}**.`);
  }
};
