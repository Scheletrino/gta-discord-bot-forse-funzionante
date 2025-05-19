
const { SlashCommandBuilder } = require('discord.js');
const { addPoints } = require('../utils/scoreManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('risposta')
    .setDescription('Rispondi al quiz')
    .addStringOption(opt =>
      opt.setName('lettera')
         .setDescription('La tua risposta (A, B, C, D)')
         .setRequired(true)
    ),
  async execute(interaction) {
    const answer = interaction.options.getString('lettera').toUpperCase();
    const map = interaction.client.activeQuestions || {};
    const correct = map[interaction.user.username];

    if (!correct) {
      return interaction.reply('❌ Nessuna domanda attiva. Usa `/minigioco`!');
    }

    if (answer === correct) {
      addPoints(interaction.user.username, 1);
      await interaction.reply(`✅ Risposta corretta! Hai guadagnato 1 punto.`);
    } else {
      await interaction.reply(`❌ Sbagliato! La risposta giusta era **${correct}**.`);
    }

    delete map[interaction.user.username];
  }
};
